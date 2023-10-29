<script setup lang="ts">
import StatusComponent from "@/components/Status/StatusComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { SongData, getSongBySpotifyId } from "@/utils/musicResource";
import { defineExpose, onBeforeMount, ref } from "vue";

const loaded = ref(false);
let statuses = ref<Array<Record<string, string>>>([]);
let tracks = ref<Array<SongData>>([]);

async function getStatuses() {
  let statusResults;
  try {
    statusResults = (await fetchy("/api/status/feed", "GET")).filter((status: { songId: string }) => status.songId !== "");
  } catch (_) {
    return;
  }
  tracks.value = await Promise.all(statusResults.map((status: Record<string, string>) => getSongBySpotifyId(status.songId)));
  statuses.value = statusResults;
}

const pausePlayingAudio = (playingId: string) =>
  Array.from(document.getElementsByClassName("status-audio")).map((audioElement) => {
    if (audioElement.id != "audio-source-" + playingId) (audioElement as HTMLAudioElement).pause();
  });

onBeforeMount(async () => {
  await getStatuses().then(() => (loaded.value = true));
});

defineExpose({ getStatuses });
</script>

<template>
  <section class="statuses" v-if="loaded && statuses.length !== 0">
    <article v-for="(status, idx) in statuses" :key="status._id" :id="'status-' + status._id">
      <StatusComponent :status="status" :track="tracks[idx]" @refreshPosts="getStatuses" @playing-audio="pausePlayingAudio" />
    </article>
  </section>
  <p v-else-if="loaded">No statuses found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 80vw;
  max-width: 36em;
}

.statuses {
  padding: 1em;
  align-items: center;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
