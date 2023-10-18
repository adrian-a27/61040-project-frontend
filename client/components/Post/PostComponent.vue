<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post", "track"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const playbackButtonIcon = ref("play_arrow");
const { currentUsername } = storeToRefs(useUserStore());
const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const togglePlayback = () => {
  const music: HTMLAudioElement = document.querySelector("#audio-source-" + props.post._id)!;
  const playbackButton: HTMLButtonElement = document.querySelector("#playback-button-" + props.post._id)!;

  console.log(music.src);
  if (music.src == "localhost://404") {
    playbackButtonIcon.value = "error";
    playbackButton.style.color = "red";
    playbackButton.disabled = true;
    playbackButton.classList.add("disabled");
  } else if (music?.classList.contains("active")) {
    music.pause();
    playbackButtonIcon.value = "play_arrow";
    music.classList.remove("active");
  } else {
    void music.play();
    playbackButtonIcon.value = "pause";
    music.classList.add("active");
  }
};
</script>

<template>
  <div class="post-heading">
    <span class="author">{{ props.post.author }}</span>
    <button type="button" :id="'playback-button-' + props.post._id" class="playback-button material-symbols-outlined" @click="togglePlayback">{{ playbackButtonIcon }}</button>
    <audio :id="'audio-source-' + props.post._id" :src="props.track.preview_url ?? 'localhost://404'">
      <!-- <source type="audio/ogg" /> -->
      Your browser does not support the audio element.
    </audio>
  </div>
  <div class="post-content">
    <img class="album-art" :src="track.image" />
    <span>{{ props.post.content }}</span>
  </div>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.post-heading {
  display: flex;
}
.author {
  font-weight: bold;
  font-size: 1.2em;
  width: 100%;
}

.playback-button {
  border: none;
  background-color: white;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  padding: 0;
}

.playback-button:not(.disabled):hover {
  background-color: lightgrey;
}

.playback-button:not(.disabled) {
  cursor: pointer;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.post-content {
  align-items: center;
  display: flex;
}

.album-art {
  width: 90px;
  height: 90px;
  margin-right: 8px;
  border-radius: 8px;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
