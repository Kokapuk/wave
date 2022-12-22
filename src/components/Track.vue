<template>
  <div class="track">
    <button
      @click="() => (usePlayerStore().currentTrackId = track.id)"
      class="track-cover"
      :style="{ backgroundImage: `url(${props.track.cover})` }">
      <CirclePlay class="play-icon" />
    </button>
    <span class="track-name">{{ props.track.name }}</span>
    <span class="track-author">{{ props.track.author }}</span>
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
  border-radius: var(--b-radius-small);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.track-cover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: black;
  opacity: 0;
  transition: var(--transition);
}

.track-cover:hover::before {
  opacity: 0.2;
}

.play-icon {
  height: 20%;
  opacity: 0;
  transition: var(--transition);
}

.track-cover:hover .play-icon {
  height: 25%;
  opacity: 1;
}

.track-name {
  font-weight: 700;
  font-size: 13px;
}

.track-author {
  font-weight: 700;
  font-size: 13px;
  color: rgb(var(--font-color-dark));
}
</style>
