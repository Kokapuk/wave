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
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { uid } from 'uid';
import { usePlayerStore } from '../stores/player';
import type { ITrack } from '@/types';
const Downloader = require('nodejs-file-downloader');
const { app } = require('@electron/remote');
const path = require('path');
const fs = require('fs');

const audio = ref<string>('');
const cover = ref<string>('');
const name = ref<string>('');
const author = ref<string>('');

async function submitHandle() {
  const trackId = uid(12);
  const trackPath = path.join(app.getPath('userData'), 'music', trackId);
  let downloadSuccesfull = true;

  let downloader = new Downloader({
    url: audio.value,
    directory: trackPath,
  });

  try {
    const { filePath } = await downloader.download();

    fs.copyFileSync(filePath, path.join(trackPath, 'audio.mp3'));
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log('Audio download failed', error);
    downloadSuccesfull = false;
  }

  downloader = new Downloader({
    url: cover.value,
    directory: trackPath,
  });

  try {
    const { filePath } = await downloader.download();

    fs.copyFileSync(filePath, path.join(trackPath, 'cover.png'));
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log('Cover download failed', error);
    downloadSuccesfull = false;
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
    fs.writeFileSync(
      path.join(app.getPath('userData'), 'music', 'import-data.json'),
      JSON.stringify([track, ...usePlayerStore().getTrackList()])
    );
  }
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
</style>
