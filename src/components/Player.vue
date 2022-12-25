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
      <div class="button-container">
        <Tooltip text="Previous track" :positioning="TooltipPositioning.left">
          <button
            @click="() => usePlayerStore().currentTrackId = usePlayerStore().getPreviousTrack(usePlayerStore().currentTrackId!).id"
            style="rotate: 180deg"
            class="player-button">
            <Chevron />
          </button>
        </Tooltip>

        <button @click="() => emit('togglePlayPause')" class="player-button">
          <CirclePlay v-if="usePlayerStore().audioIsPaused" />
          <CirclePause v-else />
        </button>

        <Tooltip text="Next track" :positioning="TooltipPositioning.right">
          <button
            @click="() => usePlayerStore().currentTrackId = usePlayerStore().getNextTrack(usePlayerStore().currentTrackId!).id"
            class="player-button">
            <Chevron />
          </button>
        </Tooltip>
      </div>
      <div class="timeline">
        <span class="time">{{ secondsToTimestamp(usePlayerStore().audioCurrentTime) }}</span>
        <Slider
          @input="(event: Event) => emit('seek', (event.target as HTMLInputElement).valueAsNumber)"
          :model-value="usePlayerStore().audioCurrentTime"
          step="1"
          :min="0"
          :max="usePlayerStore().audioDuration" />
        <span class="time">{{ secondsToTimestamp(usePlayerStore().audioDuration) }}</span>
      </div>
    </div>
    <div class="player-right">
      <Tooltip :text="usePlayerStore().audioMuted ? 'Unmute' : 'Mute'" :positioning="TooltipPositioning.top">
        <button @click="() => (usePlayerStore().audioMuted = !usePlayerStore().audioMuted)" class="player-button mute-button">
          <SpeakerMuted v-if="usePlayerStore().audioMuted || usePlayerStore().audioVolume === 0" />
          <Speaker v-else />
        </button>
      </Tooltip>
      <Slider v-model="usePlayerStore().audioVolume" @change="volumeSliderChangeHandle" step=".01" :min="0" :max="1" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { TooltipPositioning, type ITrack } from '@/types';
import Chevron from './Icons/Chevron.vue';
import CirclePlay from './Icons/CirclePlay.vue';
import CirclePause from './Icons/CirclePause.vue';
import Speaker from './Icons/Speaker.vue';
import SpeakerMuted from './Icons/SpeakerMuted.vue';
import Slider from './Controls/Slider.vue';
import Tooltip from './Controls/Tooltip.vue';
import { usePlayerStore } from '@/stores/player';
import { onMounted, ref, watch } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const emit = defineEmits(['seek', 'togglePlayPause']);
const currentTrack = ref<ITrack>(usePlayerStore().getTrackById(usePlayerStore().currentTrackId!));

onMounted(() => {
  usePlayerStore().audioVolume = useSettingsStore().getVolume();
});

watch(
  () => usePlayerStore().currentTrackId,
  () => {
    currentTrack.value = usePlayerStore().getTrackById(usePlayerStore().currentTrackId!);
  },
  { deep: true }
);

function secondsToTimestamp(seconds: number): string {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
}

function volumeSliderChangeHandle(event: Event) {
  useSettingsStore().setVolume((event.target as HTMLInputElement).valueAsNumber);
}
</script>

<style scoped>
footer {
  background-color: rgb(var(--bg));
  height: 96px;
  padding: 17px;
  display: flex;
  gap: 15%;
  border-top: var(--b-seperator);
}

.player-left {
  display: flex;
  height: 100%;
  width: 30%;
  gap: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.track-cover {
  aspect-ratio: 1/1;
  height: 100%;
}

.track-name-artist {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
}

.track-name {
  font-size: 15px;
  font-weight: 500;
}

.track-artist {
  font-size: 13px;
  font-weight: 400;
  color: rgb(var(--font-color-dark));
}

.player-middle {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 9px;
}

.button-container {
  display: flex;
  height: 35px;
  gap: 9px;
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

.timeline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  color: #6b7280;
  font-weight: 400;
  font-size: 13px;
}

.player-right {
  display: flex;
  flex: 0 0 150px;
  height: 100%;
  gap: 13px;
  align-items: center;
  justify-content: right;
}

.mute-button {
  width: 35px;
  height: 35px;
  padding: 9px;
}
</style>
