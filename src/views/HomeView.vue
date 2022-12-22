<template>
  <div class="track-list-container">
    <Track v-for="track in tracks" :track="track" />
  </div>
</template>

<script lang="ts" setup>
import Track from '@/components/Track.vue';
import { usePlayerStore } from '@/stores/player';
import type { ITrack } from '@/types';
import { ref } from 'vue';

const tracks = ref<ITrack[]>(usePlayerStore().getTrackList());
</script>

<style scoped>
.track-list-container {
  display: flex;
  flex-wrap: wrap;
  padding: 45px;
  gap: 20px;
}
</style>
