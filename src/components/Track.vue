<template>
  <div class="track">
    <button
      @contextmenu="showContextMenuClickHandle"
      @click="playPauseHandle"
      class="track-cover"
      :style="{ backgroundImage: `url('file://${props.track.cover.replaceAll('\\', '/')}')` }">
      <div class="play-pause-icon-container">
        <Transition name="play-pause" mode="out-in">
          <CirclePause
            v-if="playerStore.currentTrackId === props.track.id && !playerStore.audioIsPaused"
            class="play-pause-icon" />
          <CirclePlay v-else class="play-pause-icon" />
        </Transition>
      </div>
    </button>
    <button @click="showContextMenuClickHandle" class="context-menu-button">
      <Ellipsis />
    </button>
    <span :class="['track-name', { active: props.track.id === usePlayerStore().currentTrackId }]">{{ props.track.name }}</span>
    <span :class="['track-artist', { active: props.track.id === usePlayerStore().currentTrackId }]">
      {{ props.track.artist }}
    </span>
  </div>
  <ContextMenu
    @close="() => (contextMenuShown = false)"
    :show="contextMenuShown"
    :offset-x="contextMenuPosition.x"
    :offset-y="contextMenuPosition.y"
    :menu-items="contextMenuItems" />
</template>

<script setup lang="ts">
import CirclePlay from './Icons/CirclePlay.vue';
import CirclePause from './Icons/CirclePause.vue';
import Ellipsis from './Icons/Ellipsis.vue';
import { usePlayerStore } from '../stores/player';
import type { ITrack } from '@/types';
import { ref } from 'vue';
import ContextMenu, { type IMenuItem } from './Controls/ContextMenu.vue';
const { shell } = require('electron');
const path = require('path');

interface IProps {
  track: ITrack;
}

const props = defineProps<IProps>();
const emit = defineEmits(['deleteRequest', 'renameRequest']);
const playerStore = usePlayerStore();
const contextMenuShown = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuItems = ref<IMenuItem[]>([
  {
    text: `${props.track.artist} - ${props.track.name}`,
    disabled: true,
    separator: true,
  },
  {
    text: 'Show in explorer',
    clickHandle() {
      shell.showItemInFolder(path.join(props.track.audio, '../'));
    },
  },
  {
    text: 'Copy artist and track name',
    clickHandle() {
      navigator.clipboard.writeText(`${props.track.artist} - ${props.track.name}`);
    },
  },
  {
    text: 'Rename',
    separator: true,
    clickHandle() {
      emit('renameRequest', props.track);
    },
  },
  {
    text: 'Delete',
    danger: true,
    clickHandle() {
      emit('deleteRequest', props.track);
    },
  },
]);

function playPauseHandle() {
  if (playerStore.currentTrackId !== props.track.id) {
    playerStore.currentTrackId = props.track.id;
  } else {
    playerStore.audioIsPaused = !playerStore.audioIsPaused;
  }
}

function showContextMenuClickHandle(event: MouseEvent) {
  contextMenuShown.value = true;
  contextMenuPosition.value.x = event.clientX;
  contextMenuPosition.value.y = event.clientY;
}
</script>

<style scoped>
.track {
  width: 230px;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
}

.track-cover {
  width: 100%;
  aspect-ratio: 1/1;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: var(--b-radius);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.play-pause-icon-container {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.3);
  transition: var(--transition);
}

.track-cover:hover .play-pause-icon-container {
  opacity: 1;
}

.track-cover:active .play-pause-icon-container {
  background-color: rgb(0, 0, 0, 0.6);
}

.play-pause-icon {
  height: 20%;
}

.track-cover:hover .play-pause-icon {
  scale: 1.2;
}

.play-pause-enter-active,
.play-pause-leave-active {
  transition: var(--transition-half);
}

.play-pause-enter-from,
.play-pause-leave-to {
  scale: 1 !important;
}

.context-menu-button {
  position: absolute;
  height: 12.5%;
  aspect-ratio: 1/1;
  right: -12.5%;
  top: -12.5%;
  background-color: transparent;
  cursor: pointer;
  opacity: 0;
  transition: var(--transition);
}

.track:hover .context-menu-button {
  right: 2%;
  top: 0;
  opacity: 1;
}

.track-name {
  display: block;
  max-width: 100%;
  font-weight: 700;
  font-size: 13px;
  transition: var(--transition);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-name.active {
  color: rgb(var(--accent));
}

.track-artist {
  display: block;
  max-width: 100%;
  font-weight: 700;
  font-size: 13px;
  color: rgb(var(--font-color-dark));
  transition: var(--transition);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist.active {
  color: rgb(var(--accent));
}
</style>
