<template>
  <div class="settings-container">
    <div class="param-container">
      <span class="param-title">Music storage path</span>
      <input :value="musicStoragePath" class="param-input" readonly />
      <Button @click="chooseClickHandle">Choose</Button>
    </div>
    <div class="param-container">
      <span class="param-title">Use volume hotkeys (restart needed)</span>
      <input
        @change="(event) => useSettingsStore().setVolumeHotkeysEnabled((event.target as HTMLInputElement).checked)"
        :checked="volumeHotkeysEnabled"
        type="checkbox"
        class="switch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player';
import { useSettingsStore } from '@/stores/settings';
import { ref } from 'vue';
import Button from '@/components/Controls/Button.vue';
const { dialog, getCurrentWindow } = require('@electron/remote');
const fs = require('fs');
const path = require('path');

const musicStoragePath = ref(useSettingsStore().getMusicStoragePath());
const volumeHotkeysEnabled = ref(useSettingsStore().getVolumeHotkeysEnabled());

function chooseClickHandle() {
  const selectedPath: string[] | undefined = dialog.showOpenDialogSync(getCurrentWindow(), {
    title: 'Chosing music storage path',
    buttonLabel: 'Choose',
    properties: ['openDirectory'],
  });

  if (selectedPath === undefined) return;

  musicStoragePath.value = selectedPath[0];
  useSettingsStore().setMusicStoragePath(selectedPath[0]);

  if (fs.existsSync(path.join(musicStoragePath.value, 'import-data.json'))) {
    usePlayerStore().importTracks(musicStoragePath.value);
  } else {
    usePlayerStore().clearTrackList();
  }

  usePlayerStore().currentTrackId = null;
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
  flex: 0 0 200px;
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
  width: 150px;
}
</style>
