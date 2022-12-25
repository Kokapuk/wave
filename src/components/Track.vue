<template>
  <div class="track">
    <button
      @click="() => (usePlayerStore().currentTrackId = track.id)"
      class="track-cover"
      :style="{ backgroundImage: `url('file://${props.track.cover.replaceAll('\\', '/')}')` }">
      <CirclePlay class="play-icon" />
    </button>
    <button @click="deleteClickHandle" class="button-remove">
      <Close />
    </button>
    <span :class="['track-name', { active: props.track.id === usePlayerStore().currentTrackId }]">{{ props.track.name }}</span>
    <span :class="['track-artist', { active: props.track.id === usePlayerStore().currentTrackId }]">
      {{ props.track.artist }}
    </span>
  </div>
</template>

<script setup lang="ts">
import CirclePlay from './Icons/CirclePlay.vue';
import Close from './Icons/Close.vue';
import { usePlayerStore } from '../stores/player';
import router from '@/router';
import type { ITrack } from '@/types';

interface IProps {
  track: ITrack;
}

const props = defineProps<IProps>();

function deleteClickHandle() {
  usePlayerStore().currentTrackId = null;

  setTimeout(() => {
    usePlayerStore().deleteTrack(props.track.id);
    router.go(0);
  }, 100);
}
</script>

<style scoped>
.track {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
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

.button-remove {
  position: absolute;
  height: 12.5%;
  width: 12.5%;
  right: -12.5%;
  top: -12.5%;
  background-color: transparent;
  cursor: pointer;
  opacity: 0;
  transition: var(--transition);
}

.track:hover .button-remove {
  right: 2%;
  top: 0;
  opacity: 1;
}

.track-name {
  font-weight: 700;
  font-size: 13px;
  transition: var(--transition);
}

.track-name.active {
  color: rgb(var(--accent));
}

.track-artist {
  font-weight: 700;
  font-size: 13px;
  color: rgb(var(--font-color-dark));
  transition: var(--transition);
}

.track-artist.active {
  color: rgb(var(--accent));
}
</style>
