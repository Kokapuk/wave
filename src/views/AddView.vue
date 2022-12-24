<template>
  <form class="add-container" @submit.prevent="submitHandle">
    <div class="param-container">
      <span class="param-title">Audio</span>
      <input v-model="audio" type="url" class="param-input" required />
    </div>

    <div class="param-container">
      <span class="param-title">Cover</span>
      <input v-model="cover" type="url" class="param-input" required />
    </div>

    <div class="param-container">
      <span class="param-title">Name</span>
      <input v-model="name" type="text" class="param-input" required />
    </div>

    <div class="param-container">
      <span class="param-title">Author</span>
      <input v-model="author" type="text" class="param-input" required />
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
import { uid } from 'uid';
import ProgressBar from '../components/Controls/ProgressBar.vue';
import { usePlayerStore } from '../stores/player';
import type { ITrack } from '@/types';
import { useSettingsStore } from '@/stores/settings';
const Downloader = require('nodejs-file-downloader');
const path = require('path');
const fs = require('fs');

const audio = ref<string>('');
const cover = ref<string>('');
const name = ref<string>('');
const author = ref<string>('');
const loading = ref(false);
const progress = ref(0);

async function submitHandle() {
  const trackId = uid(12);
  const trackPath = path.join(useSettingsStore().getMusicStoragePath(), trackId);
  let downloadSuccesfull = true;

  loading.value = true;

  let downloader = new Downloader({
    url: audio.value,
    directory: trackPath,
    onProgress: (percentage: number) => {
      progress.value = percentage;
    },
  });

  try {
    const { filePath } = await downloader.download();

    fs.copyFileSync(filePath, path.join(trackPath, 'audio.mp3'));
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log('Audio download failed', error);
    downloadSuccesfull = false;
    loading.value = false;
  }

  downloader = new Downloader({
    url: cover.value,
    directory: trackPath,
    onProgress: (percentage: number) => {
      progress.value = percentage;
    },
  });

  try {
    const { filePath } = await downloader.download();

    fs.copyFileSync(filePath, path.join(trackPath, 'cover.png'));
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log('Cover download failed', error);
    downloadSuccesfull = false;
    loading.value = false;
  }

  if (downloadSuccesfull) {
    const track: ITrack = {
      id: trackId,
      audio: path.join(trackPath, 'audio.mp3'),
      cover: path.join(trackPath, 'cover.png'),
      name: name.value,
      author: author.value,
    };

    usePlayerStore().setTrackList([track, ...usePlayerStore().getTrackList()]);
  }

  audio.value = '';
  cover.value = '';
  name.value = '';
  author.value = '';

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

.param-input {
  font-size: 18px;
  padding: 10px 15px;
  width: 100%;
  border-radius: var(--b-radius);
  background-color: rgb(var(--light-gray));
  border: 1px solid transparent;
  transition: var(--transition);
}

.param-input:invalid {
  border-color: firebrick;
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
