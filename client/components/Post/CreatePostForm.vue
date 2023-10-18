<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { SongData } from "../../utils/musicResource";

import SongResultEntry from "../SongSearch/SongResultEntry.vue";
import SongSearchResults from "../SongSearch/SongSearchResults.vue";

const content = ref("");
const songQuery = ref("");
const searchResults = ref(SongSearchResults);
const emptySongData: SongData = {
  songTitle: "",
  artists: "",
  image: "",
  preview_url: "",
  id: "",
};
const chosenSong = ref(emptySongData);
const showResults = ref(false);

const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string, songId: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { content, songId },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const chooseResult = async (songData: SongData) => {
  chosenSong.value = songData;
  songQuery.value = "";
};

const emptyForm = () => {
  content.value = "";
  chosenSong.value = emptySongData;
};
</script>

<template>
  <form @submit.prevent="createPost(content, chosenSong.id)">
    <div id="song-search">
      <input
        type="text"
        id="song-search-bar-post"
        v-model="songQuery"
        placeholder="Search for a song..."
        @keyup="searchResults.generateResults"
        @focus="showResults = true"
        @blur="showResults = false"
        v-if="!chosenSong.id"
        required
      />
      <SongResultEntry v-bind:songResult="chosenSong" v-if="chosenSong.id" :showButton="true" @deleteResult="() => (chosenSong = emptySongData)" />
      <!-- <div v-if="songQuery">{{ songResults }}</div> -->
      <SongSearchResults v-show="showResults" ref="searchResults" v-bind:query="songQuery" @selectResult="chooseResult" />
    </div>
    <textarea id="content" v-model="content" placeholder="What's on your mind? " required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

#song-search {
  position: relative;
  display: flex;
  flex-direction: column;
}

#song-search-bar-post {
  margin-bottom: 8px;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
