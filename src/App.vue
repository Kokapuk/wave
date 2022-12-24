<template>
  <div class="wrapper">
    <main>
      <NavigationBar />
      <div class="page-container">
        <header class="title">{{ usePlayerStore().title }}</header>
        <div class="view">
          <RouterView />
        </div>
      </div>
    </main>
    <Transition name="player-fade">
      <Player
        v-if="usePlayerStore().currentTrackId !== null"
        @seek="seekHandle"
        @toggle-play-pause="() => usePlayerStore().audioIsPaused ? audioElement!.play() : audioElement!.pause()" />
    </Transition>
    <audio
      ref="audioElement"
      @pause="() => (usePlayerStore().audioIsPaused = true)"
      @play="() => (usePlayerStore().audioIsPaused = false)"
      @durationchange="(event: Event) => usePlayerStore().audioDuration = (event.target as HTMLAudioElement).duration"
      @loadstart="audioLoadStartHandle"
      @loadedmetadata="audioLoadHandle"
      @error="audioLoadErrorHandle"
      @timeupdate="(event: Event) => usePlayerStore().audioCurrentTime = Math.floor((event.target as HTMLAudioElement).currentTime)"
      @ended="endedHandle"
      :src="usePlayerStore().currentTrackId === null ? undefined : usePlayerStore().getTrackById(usePlayerStore().currentTrackId!).audio" />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { usePlayerStore } from './stores/player';
import Player from './components/Player.vue';
import NavigationBar from './components/NavBar.vue';
import { onMounted, ref, watch } from 'vue';
import { useSettingsStore } from './stores/settings';
import router from './router';
const path = require('path');
const fs = require('fs');

const audioElement = ref<HTMLAudioElement | null>(null);

onMounted(() => {
  if (!fs.existsSync(useSettingsStore().defaultMusicStoragePath)) {
    fs.mkdirSync(useSettingsStore().defaultMusicStoragePath, { recursive: true });
  }

  if (!fs.existsSync(path.join(useSettingsStore().defaultMusicStoragePath, 'import-data.json'))) {
    fs.writeFileSync(path.join(useSettingsStore().defaultMusicStoragePath, 'import-data.json'), '[]');
  }

  if (!fs.existsSync(useSettingsStore().getMusicStoragePath())) {
    localStorage.clear();
    router.go(0);
  }
});

watch(
  () => usePlayerStore().audioVolume,
  (newValue) => {
    audioElement.value!.volume = newValue;
  },
  { deep: true }
);

watch(
  () => usePlayerStore().audioMuted,
  (newValue) => {
    audioElement.value!.muted = newValue;
  },
  { deep: true }
);

function seekHandle(time: number) {
  audioElement.value!.currentTime = time;
}

function audioLoadStartHandle(event: Event) {
  audioElement.value!.pause();
  audioElement.value!.currentTime = 0;
}

function audioLoadHandle(event: Event) {
  const playerStore = usePlayerStore();

  audioElement.value!.volume = playerStore.audioVolume;
  playerStore.audioCurrentTime = 0;

  audioElement.value!.play();
}

function audioLoadErrorHandle(event: Event) {
  usePlayerStore().currentTrackId = null;
}

function endedHandle() {
  usePlayerStore().currentTrackId = usePlayerStore().getNextTrack(usePlayerStore().currentTrackId!).id;
}
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100vh;
  flex-direction: column;
}

main {
  display: flex;
  height: 100%;
  background-color: rgb(var(--bg));
  overflow-y: hidden;
}

.title {
  width: 100%;
  padding: 21px 41px;
  font-weight: 700;
  font-size: 33px;
  border-bottom: var(--b-seperator);
  user-select: none;
  -webkit-app-region: drag;
}

.page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.view {
  overflow-y: auto;
  height: 100%;
  position: relative;
}

.player-fade-enter-active,
.player-fade-leave-active {
  transition: var(--transition);
}

.player-fade-enter-from,
.player-fade-leave-to {
  opacity: 0;
}
</style>
