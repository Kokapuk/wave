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
    <Player
      v-if="usePlayerStore().currentTrackId !== null"
      @seek="seekHandle"
      @toggle-play-pause="() => usePlayerStore().audioIsPaused ? audioElement!.play() : audioElement!.pause()" />
    <audio
      ref="audioElement"
      @pause="() => (usePlayerStore().audioIsPaused = true)"
      @play="() => (usePlayerStore().audioIsPaused = false)"
      @durationchange="(event: Event) => usePlayerStore().audioDuration = (event.target as HTMLAudioElement).duration"
      @loadstart="audioLoadStartHandle"
      @loadedmetadata="audioLoadHandle"
      @timeupdate="(event: Event) => usePlayerStore().audioCurrentTime = Math.floor((event.target as HTMLAudioElement).currentTime)"
      @ended="endedHandle"
      v-if="usePlayerStore().currentTrackId !== null"
      :src="usePlayerStore().getTrackById(usePlayerStore().currentTrackId!).audio" />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { usePlayerStore } from './stores/player';
import Player from './components/Player.vue';
import NavigationBar from './components/NavigationBar.vue';
import { ref, watch } from 'vue';

const audioElement = ref<HTMLAudioElement | null>(null);

watch(
  () => usePlayerStore().audioVolume,
  (newValue) => {
    audioElement.value!.volume = newValue;
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
}
</style>
