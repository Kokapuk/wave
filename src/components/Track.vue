<template>
  <div class="track">
    <button
      @click="() => (usePlayerStore().currentTrackId = track.id)"
      class="track-cover"
      :style="{ backgroundImage: `url(${props.track.cover})` }">
      <CirclePlay class="play-icon" />
    </button>
    <span :class="['track-name', { active: props.track.id === usePlayerStore().currentTrackId }]">{{ props.track.name }}</span>
    <span :class="['track-author', { active: props.track.id === usePlayerStore().currentTrackId }]">
      {{ props.track.author }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { ITrack } from '@/types';
import CirclePlay from './Icons/CirclePlay.vue';
import { usePlayerStore } from '../stores/player';

interface IProps {
  track: ITrack;
}

const props = defineProps<IProps>();
</script>

<style scoped>
.track {
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
}

.track-cover {
  width: 230px;
  height: 230px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: var(--b-radius);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.play-icon {
  padding: 40%;
  opacity: 0;
  transition: var(--transition);
  background-color: rgb(0, 0, 0, 0.2);
}

.track-cover:hover .play-icon {
  scale: 1.2;
  opacity: 1;
}

.track-cover:active .play-icon {
  background-color: rgb(0, 0, 0, 0.4);
}

.track-name {
  font-weight: 700;
  font-size: 13px;
}

.track-name.active {
  color: rgb(var(--accent));
}

.track-author {
  font-weight: 700;
  font-size: 13px;
  color: rgb(var(--font-color-dark));
}

.track-author.active {
  color: rgb(var(--accent));
}
</style>
