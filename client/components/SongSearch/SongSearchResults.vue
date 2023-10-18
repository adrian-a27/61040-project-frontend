<script setup lang="ts">
import { ref } from "vue";
import { searchSongs, SongData } from "../../utils/musicResource";
import SongResultEntry from "./SongResultEntry.vue";

const props = defineProps(["query", "chosenSongId"]);
const songResults = ref(Array<SongData>());
const chosenSongId = ref(props.chosenSongId);

const generateResults = async () => {
  songResults.value = props.query ? await searchSongs(props.query) : [];
};

defineExpose({ generateResults });
const emit = defineEmits(["selectResult"]);
const chooseResult = (songData: SongData) => {
  chosenSongId.value = songData?.id;
  emit("selectResult", songData);
};
</script>

<template>
  <div v-if="query" id="results">
    <div v-for="result in songResults" :key="result.id">
      <SongResultEntry :songResult="result" @selectResult="chooseResult" />
    </div>
  </div>
</template>

<style scoped></style>
