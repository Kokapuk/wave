<template>
  <form class="add-container" @submit.prevent="submitHandle">
    <div class="param-container">
      <span class="param-title">Audio</span>
      <input v-model="audio" type="url" class="param-input" required />
    </div>

    <div class="param-container">
      <span class="param-title">Cover</span>
      <input v-model="cover" type="url" class="param-input" />
    </div>

    <div class="param-container">
      <span class="param-title">Name</span>
      <input v-model="name" type="text" class="param-input" />
    </div>

    <div class="param-container">
      <span class="param-title">Author</span>
      <input v-model="author" type="text" class="param-input" />
    </div>

    <button style="align-self: flex-end" class="button" type="submit">Add</button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { uid } from 'uid';
const Downloader = require('nodejs-file-downloader');
const { app } = require('@electron/remote');
const path = require('path');
const fs = require('fs');

const audio = ref<string>('');
const cover = ref<string>('');
const name = ref<string>('');
const author = ref<string>('');

async function submitHandle() {
  const trackPath = path.join(app.getPath('userData'), 'music', uid(12));

  const downloader = new Downloader({
    url: 'https://muzek.net/uploads/music/2020/05/Antoha_MS_Uspej_poznat.mp3',
    directory: trackPath,
  });

  try {
    const { filePath } = await downloader.download();

    fs.copyFileSync(filePath, path.join(trackPath, 'audio.mp3'));
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log('Download failed', error);
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
