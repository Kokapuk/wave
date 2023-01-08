<template>
  <div v-show="!windowMaximized" class="window-border"></div>
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
      <Player v-if="playerStore.currentTrackId !== null" @seek="seekHandle" />
    </Transition>
    <audio
      ref="audioElement"
      @durationchange="(event: Event) => playerStore.audioDuration = (event.target as HTMLAudioElement).duration"
      @loadstart="audioLoadStartHandle"
      @loadedmetadata="audioLoadHandle"
      @error="audioLoadErrorHandle"
      @timeupdate="(event: Event) => playerStore.audioCurrentTime = Math.floor((event.target as HTMLAudioElement).currentTime)"
      @ended="audioEndedHandle"
      :src="playerStore.currentTrackId === null ? undefined : audioBlob"
      :loop="playerStore.audioLoop || playerStore.getTrackList().length === 1" />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { usePlayerStore } from './stores/player';
import Player from './components/Player.vue';
import NavigationBar from './components/NavBar.vue';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useSettingsStore } from './stores/settings';
import router from './router';
const path = require('path');
const fs = require('fs');
const { getCurrentWindow, globalShortcut } = require('@electron/remote');
const { ipcRenderer } = require('electron');

const audioElement = ref<HTMLAudioElement | null>(null);
const windowMaximized = ref(false);
const playerStore = usePlayerStore();
const audioBlob = computed(() => generateBlob(playerStore.getTrackById(playerStore.currentTrackId!).audio));

onBeforeMount(() => {
  getCurrentWindow().on('maximize', () => {
    windowMaximized.value = true;
    useSettingsStore().setMaximized(true);
  });

  getCurrentWindow().on('unmaximize', () => {
    windowMaximized.value = false;
    useSettingsStore().setMaximized(false);
  });

  useSettingsStore().getMaximized() ? getCurrentWindow().maximize() : getCurrentWindow().unmaximize();
});

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

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    playerStore.currentTrackId = playerStore.getPreviousTrack(playerStore.currentTrackId!).id;
  });
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    playerStore.currentTrackId = playerStore.getNextTrack(playerStore.currentTrackId!).id;
  });
  navigator.mediaSession.setActionHandler('play', () => {
    playerStore.audioIsPaused = false;
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    playerStore.audioIsPaused = true;
  });

  if (useSettingsStore().getVolumeHotkeysEnabled()) {
    globalShortcut.register('numadd', () => {
      if (Number(playerStore.audioVolume.toFixed(2)) >= 0.95) {
        playerStore.audioVolume = 1;
        return;
      }

      playerStore.audioVolume += 0.05;
    });
    globalShortcut.register('numsub', () => {
      if (Number(playerStore.audioVolume.toFixed(2)) <= 0.05) {
        return;
      }

      playerStore.audioVolume -= 0.05;
    });
  }

  ipcRenderer.on('update-available', () => {
    playerStore.isNavBarDisabled = true;
    router.push('/update');
  });
});

watch(
  () => playerStore.currentTrackId,
  (newValue) => {
    if (newValue !== null) {
      const track = playerStore.getTrackById(newValue);
      playerStore.audioPlaybackRate = useSettingsStore().getTrackPlaybackRate(newValue);

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.name,
        artist: track.artist,
        artwork: [{ src: generateBlob(track.cover), sizes: '192x192', type: 'image/png' }],
      });
    }
  }
);

watch(
  () => playerStore.audioVolume,
  (newValue) => {
    audioElement.value!.volume = newValue * newValue;
  }
);

watch(
  () => playerStore.audioMuted,
  (newValue) => {
    audioElement.value!.muted = newValue;
  }
);

watch(
  () => playerStore.audioIsPaused,
  (newValue) => {
    newValue ? audioElement.value!.pause() : audioElement.value!.play();
  }
);

watch(
  () => playerStore.audioPlaybackRate,
  (newValue) => {
    audioElement.value!.preservesPitch = false;
    audioElement.value!.playbackRate = newValue;
  }
);

function seekHandle(time: number) {
  audioElement.value!.currentTime = time;
}

function audioLoadStartHandle() {
  playerStore.audioIsPaused = true;
  audioElement.value!.currentTime = 0;
  audioElement.value!.preservesPitch = false;
  audioElement.value!.playbackRate = playerStore.audioPlaybackRate;
}

function audioLoadHandle() {
  playerStore.audioIsPaused = false;
}

function audioLoadErrorHandle() {
  playerStore.currentTrackId = null;
}

function audioEndedHandle() {
  if (playerStore.audioShuffle) {
    while (true) {
      const nextTrackListId = Math.floor(Math.random() * playerStore.getTrackList().length);
      const nextTrackId = playerStore.getTrackList()[nextTrackListId].id;

      if (playerStore.currentTrackId !== nextTrackId) {
        playerStore.currentTrackId = nextTrackId;
        break;
      }
    }
  } else {
    playerStore.currentTrackId = playerStore.getNextTrack(playerStore.currentTrackId!).id;
  }
}

function generateBlob(filePath: string): string {
  let buffer = fs.readFileSync(filePath);
  let blob = new Blob([buffer]);

  return URL.createObjectURL(blob);
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
