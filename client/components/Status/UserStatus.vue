<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { hexFromArgb, themeFromImage, themeFromSourceColor } from "@material/material-color-utilities";
import { storeToRefs } from "pinia";
import { onUpdated, ref } from "vue";

const props = defineProps(["status", "track"]);
const emit = defineEmits(["editPost", "refreshPosts", "playingAudio"]);
const playbackButtonIcon = ref("play_arrow");
const scheme = ref(themeFromSourceColor(0).schemes.light);
const { currentUsername } = storeToRefs(useUserStore());

const assignButtonColor = (button: HTMLElement) => {
  if (button.classList.contains("button-error")) {
    button.style.backgroundColor = hexFromArgb(scheme.value.error);
    button.style.color = hexFromArgb(scheme.value.onError);
  } else if (button.classList.contains("pure-button-primary")) {
    button.style.backgroundColor = hexFromArgb(scheme.value.primary);
    button.style.color = hexFromArgb(scheme.value.onPrimary);
  } else {
    button.style.backgroundColor = hexFromArgb(scheme.value.secondary);
    button.style.color = hexFromArgb(scheme.value.onSecondary);
  }
};

async function setupPostTheme() {
  const albumArt = document.getElementById("album-art-" + props.status._id)! as HTMLImageElement;
  const theme = await themeFromImage(albumArt);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  scheme.value = systemDark ? theme.schemes.dark : theme.schemes.light;

  const status = document.getElementById("status-" + props.status._id)!;
  status.style.backgroundColor = hexFromArgb(scheme.value.primaryContainer);
  status.style.color = hexFromArgb(scheme.value.onPrimaryContainer);

  Array.from(status.getElementsByClassName("btn-small")).map((el) => assignButtonColor(el as HTMLElement));
  const playbackButton: HTMLButtonElement = document.querySelector("#playback-button-" + props.status._id)!;

  // const userIcon: HTMLElement = Array.from(status.getElementsByClassName("user-icon"))[0];
  // userIcon.style.backgroundColor = hexFromArgb(scheme.value.tertiaryContainer);
  // userIcon.style.color = hexFromArgb(scheme.value.onTertiaryContainer);

  playbackButton.style.backgroundColor = hexFromArgb(scheme.value.primary);
  playbackButton.style.color = hexFromArgb(scheme.value.onPrimary);
}

onUpdated(async () => {
  await setupPostTheme();
});

const updateStatus = async () => {
  try {
    await fetchy(`/api/status/`, "PATCH", { body: { update: { songId: props.track.id } } });
  } catch (e) {
    return;
  }
};

const togglePlayback = () => {
  const music: HTMLAudioElement = document.querySelector("#audio-source-" + props.status._id)!;
  const playbackButton: HTMLButtonElement = document.querySelector("#playback-button-" + props.status._id)!;

  if (!music.src) {
    emit("playingAudio", props.status._id);
    playbackButtonIcon.value = "error";
    playbackButton.style.backgroundColor = hexFromArgb(scheme.value.error);
    playbackButton.style.color = hexFromArgb(scheme.value.onError);
    playbackButton.disabled = true;
    playbackButton.classList.add("disabled");
  } else if (music?.classList.contains("active")) {
    music.pause();
  } else {
    void updateStatus();
    emit("playingAudio", props.status._id);
    void music.play();
  }
};

const usePlayButton = () => {
  const music: HTMLAudioElement = document.querySelector("#audio-source-" + props.status._id)!;
  const playbackButton: HTMLButtonElement = document.querySelector("#playback-button-" + props.status._id)!;
  playbackButtonIcon.value = "play_arrow";
  playbackButton.style.backgroundColor = hexFromArgb(scheme.value.primary);
  playbackButton.style.color = hexFromArgb(scheme.value.onPrimary);
  music.classList.remove("active");
};

const usePauseButton = () => {
  const music: HTMLAudioElement = document.querySelector("#audio-source-" + props.status._id)!;
  const playbackButton: HTMLButtonElement = document.querySelector("#playback-button-" + props.status._id)!;
  playbackButtonIcon.value = "pause";
  playbackButton.style.backgroundColor = hexFromArgb(scheme.value.primary);
  playbackButton.style.color = hexFromArgb(scheme.value.onPrimary);
  music.classList.add("active");
};
</script>

<template>
  <div class="status-content">
    <img :id="'album-art-' + props.status._id" :src="track.image" class="album-art" crossOrigin="Anonymous" />
    <span class="song-info">
      <!-- <div class="album-name">{{ props.track.albumName }}</div> -->
      <div class="song-title">{{ props.track.songTitle }}</div>
      <div class="artists">{{ props.track.artists }}</div>
    </span>
    <button type="button" :id="'playback-button-' + props.status._id" class="playback-button material-symbols-outlined" @click="togglePlayback">{{ playbackButtonIcon }}</button>
    <audio class="status-audio" :id="'audio-source-' + props.status._id" :src="props.status.preview_url ?? props.track.preview_url" @play="usePauseButton" @pause="usePlayButton">
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<style scoped>
.album-name {
  font-size: 0.9em;
}

.song-title {
  font-size: 1em;
  padding: 8px 0px;
}

.artists {
  font-size: 0.85em;
}

.user-icon {
  border: none;
  background-color: var(--tertiary-container);
  height: 24px;
  width: 24px;
  border-radius: 100%;
  padding: 8px;
  font-size: 24px;
  margin-right: 8px;
}

p {
  margin: 0em;
}

.status-heading {
  display: flex;
}

.user {
  font-weight: bold;
  font-size: 1.2em;
  width: 100%;
  line-height: 36px;
}

.playback-button {
  border: none;
  background-color: white;
  height: 40px;
  width: 40px;
  border-radius: 100%;
  padding: 8px;
  margin: 4px;
  font-size: 24px;
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

.status-content {
  align-items: center;
  display: flex;
}

.song-info {
  width: 100%;
  margin-bottom: 16px;
}

.album-art {
  width: 75px;
  height: 75px;
  margin-right: 16px;
  border-radius: 100%;
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
