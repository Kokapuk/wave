<template>
  <footer>
    <div class="player-left">
      <img class="track-img" src="https://i.scdn.co/image/ab67616d00004851fd56f3c7a294f5cfe51c7b17" />
      <div class="track-name-author">
        <span class="track-name">Jingle Bell Rock</span>
        <span class="track-author">Bobby Helms</span>
      </div>
    </div>
    <div class="player-middle">
      <div class="button-container">
        <Tooltip text="Previous track" :positioning="TooltipPositioning.left">
          <button style="rotate: 180deg" class="player-button"><Chevron /></button>
        </Tooltip>

        <button class="player-button"><CirclePlay /></button>

        <Tooltip text="Next track" :positioning="TooltipPositioning.right">
          <button class="player-button"><Chevron /></button>
        </Tooltip>
      </div>
      <div class="timeline">
        <span class="time">2:49</span>
        <Slider :model-value="50" step="1" :min="0" :max="100" />
        <span class="time">3:37</span>
      </div>
    </div>
    <div class="player-right">
      <button class="player-button mute-button"><Speaker /></button>
      <Slider :model-value="0.5" step=".01" :min="0" :max="1" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { TooltipPositioning } from '@/types';
import Chevron from './Icons/Chevron.vue';
import CirclePlay from './Icons/CirclePlay.vue';
import Speaker from './Icons/Speaker.vue';
import Slider from './Controls/Slider.vue';
import Tooltip from './Controls/Tooltip.vue';
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

.track-img {
  aspect-ratio: 1/1;
  height: 100%;
}

.track-name-author {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
}

.track-name {
  font-size: 15px;
  font-weight: 500;
}

.track-author {
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

.icon {
  fill: #8c8c8c;
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
