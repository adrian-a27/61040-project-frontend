<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { SongData } from "../../utils/musicResource";

import SongResultEntry from "../SongSearch/SongResultEntry.vue";
import SongSearchResults from "../SongSearch/SongSearchResults.vue";

const content = ref("");
const songQuery = ref("");
const searchResults = ref(SongSearchResults);

const chosenSong = ref(<SongData>{});
const showResults = ref(false);

const emit = defineEmits(["refreshPosts", "closeSheet"]);

const updateStatus = async () => {
  try {
    await fetchy(`/api/status/`, "PATCH", { body: { update: { songId: chosenSong.value.id } } });
  } catch (e) {
    return;
  }
};

const createPost = async (content: string, songId: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { content, songId },
    });
  } catch (_) {
    return;
  }
  void updateStatus();
  emit("closeSheet");
  emit("refreshPosts");
  emptyForm();
};

const chooseResult = async (songData: SongData) => {
  chosenSong.value = songData;
  songQuery.value = "";
};

const emptyForm = () => {
  content.value = "";
  chosenSong.value = <SongData>{};
};
</script>

<template>
  <div class="creation-form">
    <form @submit.prevent="createPost(content, chosenSong.id)">
      <div class="creation-form-header">
        <div class="close-button material-symbols-outlined" @click="emit('closeSheet')">close</div>
        <h2 class="hint-text">Create a post:</h2>
      </div>

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
        <SongResultEntry v-bind:songResult="chosenSong" v-if="chosenSong.id" :showButton="true" @deleteResult="() => (chosenSong = <SongData>{})" />
        <SongSearchResults v-show="showResults" ref="searchResults" v-bind:query="songQuery" @selectResult="chooseResult" />
      </div>
      <textarea id="content" v-model="content" placeholder="What's on your mind? " required> </textarea>
      <button type="submit" class="pure-button-primary pure-button">Post</button>
    </form>
  </div>
</template>

<style scoped>
.creation-form {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
}

.creation-form-header {
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items: center;
  float: left;
  gap: 0vw;
  /* background-color: pink; */
}

.hint-text {
  padding-right: 50vw;
}

.close-button {
  cursor: pointer;
  margin-right: 16px;
}

form {
  background-color: var(--background);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  padding: 1em;
  height: 100%;
}

#song-search {
  position: relative;
  display: flex;
  flex-direction: column;

  width: 80vw;
  max-width: 36em;
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
  width: 80vw;
  max-width: 36em;
}
</style>
