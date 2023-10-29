<script setup lang="ts">
import StatusListComponent from "@/components/Status/StatusListComponent.vue";
import UserStatus from "@/components/Status/UserStatus.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";
import { SongData, getSongBySpotifyId } from "../utils/musicResource";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const status = ref(<Record<string, string>>{});
const track = ref(<SongData>{});

const getUserStatus = async () => {
  let statusResult;
  try {
    statusResult = await fetchy("/api/status", "GET");
  } catch (_) {
    return;
  }
  status.value = statusResult;
  status.value.user = currentUsername.value;
  track.value = await getSongBySpotifyId(status.value.songId);
};

const pausePlayingAudio = (playingId: string) =>
  Array.from(document.getElementsByClassName("status-audio")).map((audioElement) => {
    if (audioElement.id != "audio-source-" + playingId) (audioElement as HTMLAudioElement).pause();
  });

onBeforeMount(async () => {
  await getUserStatus();
});
</script>

<template>
  <main>
    <h1>What are we listening to?</h1>
    <StatusListComponent ref="statusList" />
    <article :id="'status-' + status._id">
      <UserStatus class="user-status" :status="status" :track="track" @refreshPosts="getUserStatus" @playing-audio="pausePlayingAudio" />
    </article>
  </main>
</template>

<style scoped>
main {
  padding: 8px 36px;
  height: 100%;
}

article {
  position: fixed;
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 75vw;
  /* height: vh; */
  max-width: 36em;
  bottom: 96px;
  left: 50%;
  transform: translateX(-50%);
}

h1 {
  text-align: left;
}
</style>
