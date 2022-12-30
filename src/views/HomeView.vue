<template>
  <div v-if="tracks.length > 0" class="track-list-container">
    <Track @delete-request="deleteRequestHandle" v-for="track in tracks" :track="track" />
  </div>
  <span v-else class="empty-placeholder-center">You library is empty</span>
  <Modal title="Delete track" :show="modalShow">
    <span v-if="deleteRequestTrack !== null">
      Are you sure you want to delete <b>{{ deleteRequestTrack!.artist }} - {{ deleteRequestTrack!.name }} </b>?
    </span>
    <div class="separator"></div>
    <div class="modal-button-container">
      <button @click="() => deleteTrack(deleteRequestTrack!)" class="button low-attention">Yes</button>
      <button @click="() => (modalShow = false)" class="button">No</button>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Track from '@/components/Track.vue';
import Modal from '@/components/Modal.vue';
import { usePlayerStore } from '@/stores/player';
import { useSettingsStore } from '@/stores/settings';
import type { ITrack } from '@/types';
import { ref } from 'vue';

const playerStore = usePlayerStore();
playerStore.importTracks(useSettingsStore().getMusicStoragePath());
const tracks = ref<ITrack[]>(playerStore.getTrackList());
const deleteRequestTrack = ref<ITrack | null>(null);
const modalShow = ref(false);

function deleteRequestHandle(track: ITrack) {
  deleteRequestTrack.value = track;
  modalShow.value = true;
}

function deleteTrack(track: ITrack) {
  modalShow.value = false;
  playerStore.currentTrackId = null;
  playerStore.deleteTrack(track.id);
  tracks.value = playerStore.getTrackList();
}
</script>

<style scoped>
.track-list-container {
  display: flex;
  flex-wrap: wrap;
  padding: 45px;
  gap: 20px;
  justify-content: center;
}

.modal-button-container {
  display: flex;
  gap: 10px;
  justify-content: right;
}
</style>
