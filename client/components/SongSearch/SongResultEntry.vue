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
  background-color: white;
  border-radius: 8px;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  padding: 8px;
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
  background-color: white;
  cursor: pointer;
  height: 35px;
  border-radius: 50%;
}

.deselect-button:hover {
  background-color: lightgrey;
}
</style>
