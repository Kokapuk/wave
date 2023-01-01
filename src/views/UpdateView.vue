<template>
  <div class="center progress-container">
    <Logo class="logo" />
    <ProgressBar :progress="downloadProgress" />
    <div class="empty-placeholder">Downloading updates, don't close the app</div>
    <div class="empty-placeholder">
      You don't have to do anything, <b class="color-accent" co>Wave</b> will automatically download and install the updates.
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '@/components/Controls/ProgressBar.vue';
import Logo from '@/components/Icons/Logo.vue';
import { ref } from 'vue';
const { ipcRenderer } = require('electron');

const downloadProgress = ref(0);

ipcRenderer.on('download-progress', (event: any, data: any) => {
  downloadProgress.value = data;
});
</script>

<style scoped>
.progress-container {
  padding: 50px;
  flex-direction: column;
  gap: 15px;
}

.logo {
  height: 25%;
  stroke: rgb(var(--accent));
  animation: logo 500ms linear infinite alternate;
}

@keyframes logo {
  0% {
    scale: 1;
  }
  20% {
    scale: 0.8;
  }
  100% {
    scale: 0.8;
  }
}
</style>
