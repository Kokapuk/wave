<template>
  <form class="add-container" @submit.prevent="submitHandle">
    <div class="param-container">
      <span class="param-title">Audio</span>
      <input v-model.trim="audio" placeholder="Url or path" type="text" class="input param-input" required />
      <Button type="button" @click="audioChooseClickHandle" class="param-button">Choose</Button>
    </div>

    <div class="param-container">
      <span class="param-title">Cover</span>
      <input v-model.trim="cover" placeholder="Url or path" type="text" class="input param-input" required />
      <Button type="button" @click="coverChooseClickHandle" class="param-button">Choose</Button>
    </div>

    <div class="param-container">
      <span class="param-title">Name</span>
      <input v-model.trim="name" type="text" class="input param-input" required />
    </div>

    <div class="param-container">
      <span class="param-title">Artist</span>
      <input v-model.trim="artist" type="text" class="input param-input" required />
    </div>

    <Button type="submit">Add</Button>
  </form>
  <div v-if="loading" class="loading-container">
    <ProgressBar :progress="progress" />
    <span class="empty-placeholder">Downloading the track...</span>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { ref } from 'vue';
import ProgressBar from '../components/Controls/ProgressBar.vue';
import Button from '../components/Controls/Button.vue';
import { usePlayerStore } from '../stores/player';
const { dialog, getCurrentWindow } = require('@electron/remote');

const audio = ref<string>('');
const cover = ref<string>('');
const name = ref<string>('');
const artist = ref<string>('');
const loading = ref(false);
const progress = ref(0);
const playerStore = usePlayerStore();

async function submitHandle() {
  loading.value = true;
  playerStore.isNavBarDisabled = true;

  await playerStore.loadTrack(
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
  playerStore.isNavBarDisabled = false;

  router.push('/');
}

function audioChooseClickHandle() {
  const selectedPath: string[] | undefined = dialog.showOpenDialogSync(getCurrentWindow(), {
    title: 'Chosing audio file',
    buttonLabel: 'Choose audio',
    properties: ['openFile'],
    filters: [
      { name: 'Audio', extensions: ['m4a', 'flac', 'mp3', 'mp4', 'wav', 'aac', 'ogg'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (selectedPath === undefined) return;
  audio.value = selectedPath[0];
}

function coverChooseClickHandle() {
  const selectedPath: string[] | undefined = dialog.showOpenDialogSync(getCurrentWindow(), {
    title: 'Chosing cover file',
    buttonLabel: 'Choose cover',
    properties: ['openFile'],
    filters: [
      { name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'bmp', 'webp'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (selectedPath === undefined) return;
  cover.value = selectedPath[0];
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
  gap: 15px;
}

.param-title {
  color: rgb(var(--font-color-dark));
  font-size: 18px;
  width: 100px;
  font-weight: 600;
}

.param-input {
  padding: 10px 15px;
  width: 100%;
}

.param-button {
  flex: 0 0 min-content;
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
