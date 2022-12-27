<template>
  <form class="add-container" @submit.prevent="submitHandle">
    <div class="param-container">
      <span class="param-title">Audio</span>
      <input v-model="audio" type="url" class="input" required />
    </div>

    <div class="param-container">
      <span class="param-title">Cover</span>
      <input v-model="cover" type="url" class="input" required />
    </div>

    <div class="param-container">
      <span class="param-title">Name</span>
      <input v-model="name" type="text" class="input" required />
    </div>

    <div class="param-container">
      <span class="param-title">Artist</span>
      <input v-model="artist" type="text" class="input" required />
    </div>

    <button style="align-self: flex-end" class="button" type="submit">Add</button>
  </form>
  <div v-if="loading" class="loading-container">
    <ProgressBar :progress="progress" />
    <span class="empty-placeholder">Downloading the track...</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ProgressBar from '../components/Controls/ProgressBar.vue';
import { usePlayerStore } from '../stores/player';

const audio = ref<string>('');
const cover = ref<string>('');
const name = ref<string>('');
const artist = ref<string>('');
const loading = ref(false);
const progress = ref(0);
const playerStore = usePlayerStore();

async function submitHandle() {
  loading.value = true;

  await playerStore.downloadTrack(
    { id: '', audio: audio.value, cover: cover.value, name: name.value, artist: artist.value },
    (percentage: number) => {
      progress.value = percentage;
    }
  );

  audio.value = '';
  cover.value = '';
  name.value = '';
  artist.value = '';

  loading.value = false;
}
</script>

<style scoped>
.add-container {
  display: flex;
  padding: 50px;
  flex-direction: column;
  gap: 25px;
}

.param-container {
  display: flex;
  align-items: center;
}

.param-title {
  color: rgb(var(--font-color-dark));
  font-size: 18px;
  width: 100px;
  font-weight: 600;
}

.input {
  width: 100%;
}

.loading-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0;
  top: 0;
  background-color: rgb(var(--bg));
  height: 100%;
  width: 100%;
  padding: 0 50px;
  align-items: center;
  justify-content: center;
  gap: 15px;
}
</style>
