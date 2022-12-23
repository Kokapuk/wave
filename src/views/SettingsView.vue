<template>
  <div class="settings-container">
    <div class="param-container">
      <span class="param-title">Music storage path</span>
      <input :value="musicStoragePath" class="param-input" readonly />
      <button @click="chooseClickHandle" class="button">Choose</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import { ref } from 'vue';
const { dialog, getCurrentWindow } = require('@electron/remote');

const musicStoragePath = ref(useSettingsStore().getMusicStoragePath());

function chooseClickHandle() {
  const path: string | undefined = dialog.showOpenDialogSync(getCurrentWindow(), {
    title: 'Chosing music storage path',
    buttonLabel: 'Choose',
    properties: ['openDirectory'],
  });

  if (path === undefined) return;

  musicStoragePath.value = path;
  useSettingsStore().setMusicStoragePath(path);
}
</script>

<style scoped>
.settings-container {
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
  width: 20%;
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

.button {
  width: 15%;
}
</style>
