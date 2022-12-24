<template>
  <div v-if="tracks.length > 0" class="track-list-container">
    <Track v-for="track in tracks" :track="track" />
  </div>
  <span v-else class="empty-placeholder-center">You library is empty</span>
</template>

<script lang="ts" setup>
import Track from '@/components/Track.vue';
import { usePlayerStore } from '@/stores/player';
import { useSettingsStore } from '@/stores/settings';
import type { ITrack } from '@/types';
import { ref } from 'vue';

usePlayerStore().importTracks(useSettingsStore().getMusicStoragePath());

const tracks = ref<ITrack[]>(usePlayerStore().getTrackList());
</script>

<style scoped>
.track-list-container {
  display: flex;
  flex-wrap: wrap;
  padding: 45px;
  gap: 20px;
  justify-content: center;
}
</style>
