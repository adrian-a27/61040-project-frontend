<script setup lang="ts">
import { PropType } from "vue";

import { SongData } from "../../utils/musicResource";

const emit = defineEmits(["selectResult", "deleteResult"]);

const props = defineProps({
  songResult: Object as PropType<SongData>,
  showButton: Boolean,
});

const selectResult = () => emit("selectResult", props.songResult);
const deleteResult = () => emit("deleteResult");
</script>

<template>
  <div class="card" @mousedown="selectResult">
    <img class="album-art" :src="props.songResult?.image" />
    <span class="song-info">
      <div class="song-title">{{ props.songResult?.songTitle }}</div>
      <div class="artists">{{ props.songResult?.artists }}</div>
    </span>
    <button type="button" v-if="showButton" class="deselect-button material-symbols-outlined" @click="deleteResult">cancel</button>
  </div>
</template>

<style scoped>
.card {
  border-radius: 8px;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  padding: 8px;

  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.album-art {
  width: 90px;
  height: 90px;
  margin-right: 8px;
  border-radius: 8px;
}

.song-info {
  width: 100%;
}

.deselect-button {
  border: none;
  height: 40px;
  width: 40px;
  border-radius: 100%;
  padding: 8px;
  margin: 4px;
  font-size: 24px;

  cursor: pointer;

  background-color: var(--primary);
  color: var(--on-primary);
}

.deselect-button:hover {
  background-color: lightgrey;
}
</style>
