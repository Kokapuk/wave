<template>
  <footer>
    <div class="player-left">
      <img class="track-cover" :src="currentTrack.cover" />
      <div class="track-name-artist">
        <span class="track-name">{{ currentTrack.name }}</span>
        <span class="track-artist">{{ currentTrack.artist }}</span>
      </div>
    </div>
    <div class="player-middle">
      <div class="media-buttons-container">
        <Tooltip text="Loop" :positioning="TooltipPositioning.top">
          <button @click="() => (playerStore.audioLoop = !playerStore.audioLoop)" class="player-button small">
            <SquareArrows style="transition: none" :class="{ 'icon-active': playerStore.audioLoop }" />
          </button>
        </Tooltip>

        <Tooltip text="Previous track" :positioning="TooltipPositioning.top">
          <button @click="playPreviousTrackClickHandle" class="player-button small">
            <Backward />
          </button>
        </Tooltip>

        <button @click="() => (playerStore.audioIsPaused = !playerStore.audioIsPaused)" class="player-button">
          <CirclePlay v-if="playerStore.audioIsPaused" />
          <CirclePause v-else />
        </button>

        <Tooltip text="Next track" :positioning="TooltipPositioning.top">
          <button
            @click="() => playerStore.currentTrackId = playerStore.getNextTrack(playerStore.currentTrackId!).id"
            class="player-button small">
            <Forward />
          </button>
        </Tooltip>

        <Tooltip text="Shuffle" :positioning="TooltipPositioning.top">
          <button @click="() => (playerStore.audioShuffle = !playerStore.audioShuffle)" class="player-button small">
            <Shuffle style="transition: none" :class="{ 'icon-active': playerStore.audioShuffle }" />
          </button>
        </Tooltip>
      </div>
      <div class="timeline">
        <span class="slider-value" style="text-align: start">{{ secondsToTimestamp(playerStore.audioCurrentTime) }}</span>
        <Slider
          @input="(event: Event) => emit('seek', (event.target as HTMLInputElement).valueAsNumber)"
          :model-value="playerStore.audioCurrentTime"
          step="1"
          :min="0"
          :max="playerStore.audioDuration" />
        <span class="slider-value" style="text-aling: end">{{ secondsToTimestamp(playerStore.audioDuration) }}</span>
      </div>
    </div>
    <div class="player-right">
      <div class="player-slider-container">
        <Tooltip
          :key="JSON.stringify(playerStore.audioMuted)"
          :text="playerStore.audioMuted ? 'Unmute' : 'Mute'"
          :positioning="TooltipPositioning.left">
          <button @click="() => (playerStore.audioMuted = !playerStore.audioMuted)" class="player-button slider-button">
            <SpeakerMuted v-if="playerStore.audioMuted || playerStore.audioVolume === 0" />
            <Speaker v-else />
          </button>
        </Tooltip>
        <Tooltip :hide="!useSettingsStore().getVolumeHotkeysEnabled()" text="Num+/Num-" :positioning="TooltipPositioning.top">
          <Slider
            class="volume-slider"
            v-model="playerStore.audioVolume"
            @change="volumeSliderChangeHandle"
            step=".01"
            :min="0"
            :max="1" />
        </Tooltip>
        <span class="slider-value"> {{ Math.round(playerStore.audioVolume * 100) }}% </span>
      </div>
      <div class="player-slider-container">
        <Tooltip text="Reset" :positioning="TooltipPositioning.left">
          <button @click="playbackRateResetClickHandle" class="player-button slider-button">
            <Clock />
          </button>
        </Tooltip>
        <Tooltip :hide="!useSettingsStore().getVolumeHotkeysEnabled()" text="Num+/Num-" :positioning="TooltipPositioning.top">
          <Slider
            class="volume-slider"
            v-model="playerStore.audioPlaybackRate"
            @change="playbackRateSliderChangeHandle"
            step=".05"
            :min="0.5"
            :max="2" />
        </Tooltip>
        <span class="slider-value"> {{ playerStore.audioPlaybackRate.toFixed(2) }}x </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { TooltipPositioning, type ITrack } from '@/types';
import Backward from './Icons/Backward.vue';
import Forward from './Icons/Forward.vue';
import CirclePlay from './Icons/CirclePlay.vue';
import CirclePause from './Icons/CirclePause.vue';
import Speaker from './Icons/Speaker.vue';
import SpeakerMuted from './Icons/SpeakerMuted.vue';
import SquareArrows from './Icons/SquareArrows.vue';
import Shuffle from './Icons/Shuffle.vue';
import Slider from './Controls/Slider.vue';
import Tooltip from './Controls/Tooltip.vue';
import { usePlayerStore } from '@/stores/player';
import { onMounted, ref, watch } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import Clock from './Icons/Clock.vue';

const emit = defineEmits(['seek']);
const currentTrack = ref<ITrack>(usePlayerStore().getTrackById(usePlayerStore().currentTrackId!));
const playerStore = usePlayerStore();

onMounted(() => {
  playerStore.audioVolume = useSettingsStore().getVolume();
});

watch(
  () => playerStore.currentTrackId,
  () => {
    currentTrack.value = playerStore.getTrackById(playerStore.currentTrackId!);
  },
  { deep: true }
);

function secondsToTimestamp(seconds: number): string {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
}

function volumeSliderChangeHandle(event: Event) {
  useSettingsStore().setVolume((event.target as HTMLInputElement).valueAsNumber);
}

function playbackRateSliderChangeHandle(event: Event) {
  const slider = event.target as HTMLInputElement;
  playerStore.audioPlaybackRate = slider.valueAsNumber;
  useSettingsStore().setTrackPlaybackRate({ trackId: playerStore.currentTrackId!, playbackRate: playerStore.audioPlaybackRate });
}

function playPreviousTrackClickHandle() {
  if (playerStore.audioCurrentTime < 5) {
    playerStore.currentTrackId = playerStore.getPreviousTrack(playerStore.currentTrackId!).id;
    return;
  }

  emit('seek', 0);
}

function playbackRateResetClickHandle() {
  useSettingsStore().setTrackPlaybackRate({ trackId: playerStore.currentTrackId!, playbackRate: 1 });
  playerStore.audioPlaybackRate = 1;
}
</script>

<style scoped>
footer {
  background-color: rgb(var(--bg));
  height: 96px;
  padding: 17px;
  display: flex;
  gap: 10%;
  border-top: var(--b-seperator);
}

.player-left {
  display: flex;
  height: 100%;
  flex: 0 0 20%;
  max-width: 20%;
  gap: 13px;
}

.track-cover {
  height: 100%;
  aspect-ratio: 1/1;
}

.track-name-artist {
  width: calc(100% - 61px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.track-name {
  display: block;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.track-artist {
  display: block;
  font-size: 13px;
  font-weight: 400;
  color: rgb(var(--font-color-dark));
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.player-middle {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 9px;
}

.media-buttons-container {
  display: flex;
  height: 35px;
  gap: 15px;
  justify-content: center;
}

.player-button {
  height: 100%;
  background-color: transparent;
  cursor: pointer;
  transition: var(--transition);
}

.player-button:hover {
  scale: 1.1;
}

.player-button:active {
  scale: 0.9;
}

.player-button.small {
  height: 60%;
}

.icon-active {
  fill: rgb(var(--accent));
}

.timeline {
  display: flex;
  align-items: center;
  gap: 13px;
}

.player-right {
  display: flex;
  flex-direction: column;
  flex: 0 0 20%;
  height: 100%;
  align-items: right;
  justify-content: center;
  gap: 5px;
}

.player-slider-container {
  display: flex;
  flex: 0 0 20%;
  align-items: center;
  gap: 10px;
  justify-content: right;
}

.slider-button {
  width: 35px;
  height: 35px;
  padding: 9px;
}

.volume-slider {
  width: 125px;
}

.slider-value {
  color: #6b7280;
  font-weight: 400;
  font-size: 13px;
  flex: 0 0 5ch;
  text-align: right;
}
</style>
