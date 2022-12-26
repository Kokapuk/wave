<template>
  <div v-if="!windowMaximized" class="window-border"></div>
  <div class="wrapper">
    <main>
      <NavigationBar />
      <div class="page-container">
        <header class="title">{{ playerStore.title }}</header>
        <div class="view">
          <RouterView />
        </div>
      </div>
    </main>
    <Transition name="player-fade">
      <Player
        v-if="playerStore.currentTrackId !== null"
        @seek="seekHandle"
        @toggle-play-pause="() => playerStore.audioIsPaused ? audioElement!.play() : audioElement!.pause()" />
    </Transition>
    <audio
      ref="audioElement"
      @pause="() => (playerStore.audioIsPaused = true)"
      @play="() => (playerStore.audioIsPaused = false)"
      @durationchange="(event: Event) => playerStore.audioDuration = (event.target as HTMLAudioElement).duration"
      @loadstart="audioLoadStartHandle"
      @loadedmetadata="audioLoadHandle"
      @error="audioLoadErrorHandle"
      @timeupdate="(event: Event) => playerStore.audioCurrentTime = Math.floor((event.target as HTMLAudioElement).currentTime)"
      @ended="endedHandle"
      :src="playerStore.currentTrackId === null ? undefined : playerStore.getTrackById(playerStore.currentTrackId!).audio"
      :loop="playerStore.audioLoop" />
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
const { getCurrentWindow, globalShortcut } = require('@electron/remote');

const audioElement = ref<HTMLAudioElement | null>(null);
const windowMaximized = ref(false);
const playerStore = usePlayerStore();

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

  getCurrentWindow().on('maximize', () => {
    windowMaximized.value = true;
    useSettingsStore().setMaximized(true);
  });

  getCurrentWindow().on('unmaximize', () => {
    windowMaximized.value = false;
    useSettingsStore().setMaximized(false);
  });

  useSettingsStore().getMaximized() ? getCurrentWindow().maximize() : getCurrentWindow().unmaximize();

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    playerStore.currentTrackId = playerStore.getPreviousTrack(playerStore.currentTrackId!).id;
  });
  navigator.mediaSession.setActionHandler('nexttrack', function () {
    playerStore.currentTrackId = playerStore.getNextTrack(playerStore.currentTrackId!).id;
  });

  globalShortcut.register('numadd', () => {
    if (playerStore.audioVolume > 0.95) {
      playerStore.audioVolume = 1;
      return;
    }

    playerStore.audioVolume += 0.05;
  });
  globalShortcut.register('numsub', () => {
    if (playerStore.audioVolume <= 0.05) {
      return;
    }

    playerStore.audioVolume -= 0.05;
  });
});

watch(
  () => playerStore.currentTrackId,
  (newValue) => {
    if (newValue !== null) {
      const track = playerStore.getTrackById(newValue);

      let buffer = fs.readFileSync(track.cover);
      let blob = new Blob([buffer]);

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.name,
        artist: track.artist,
        artwork: [{ src: URL.createObjectURL(blob), sizes: '192x192', type: 'image/png' }],
      });
    }
  }
);

watch(
  () => playerStore.audioVolume,
  (newValue) => {
    audioElement.value!.volume = newValue;
  },
  { deep: true }
);

watch(
  () => playerStore.audioMuted,
  (newValue) => {
    audioElement.value!.muted = newValue;
  },
  { deep: true }
);

function seekHandle(time: number) {
  audioElement.value!.currentTime = time;
}

function audioLoadStartHandle() {
  audioElement.value!.pause();
  audioElement.value!.currentTime = 0;
}

function audioLoadHandle() {
  audioElement.value!.volume = playerStore.audioVolume;
  playerStore.audioCurrentTime = 0;

  audioElement.value!.play();
}

function audioLoadErrorHandle() {
  playerStore.currentTrackId = null;
}

function endedHandle() {
  playerStore.currentTrackId = playerStore.getNextTrack(playerStore.currentTrackId!).id;
}
</script>

<style scoped>
.window-border {
  z-index: 5;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-shadow: inset 0px 0px 0px 1px var(--b-seperator-color);
  pointer-events: none;
}

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
