<template>
  <div class="track">
    <button
      @click="() => (usePlayerStore().currentTrackId = track.id)"
      class="track-cover"
      :style="{ backgroundImage: `url('file://${replaceAll(props.track.cover, '\\', '/')}')` }">
      <CirclePlay class="play-icon" />
    </button>
    <button @click="deleteClickHandle" class="button-delete">
      <Close />
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
import Close from './Icons/Close.vue';
import { usePlayerStore } from '../stores/player';
import router from '@/router';

interface IProps {
  track: ITrack;
}

const props = defineProps<IProps>();

function replaceAll(str: string, strToReplace: string, strToReplaceWith: string): string {
  while (str.includes(strToReplace)) {
    str = str.replace(strToReplace, strToReplaceWith);
  }

  return str;
}

function deleteClickHandle(event: MouseEvent) {
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

.button-delete {
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

.track:hover .button-delete {
  right: 2%;
  top: 0;
  opacity: 1;
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
