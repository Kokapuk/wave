<template>
  <div v-if="tracks.length > 0" class="track-list-container">
    <Track @delete-request="deleteRequestHandle" @rename-request="renameRequestHandle" v-for="track in tracks" :track="track" />
  </div>
  <span v-else class="empty-placeholder-center">You library is empty</span>
  <Modal @close-request="() => (deleteModalShow = false)" title="Delete track" :show="deleteModalShow">
    <span v-if="deleteRequestTrack !== null">
      Are you sure you want to delete <b>{{ deleteRequestTrack!.artist }} - {{ deleteRequestTrack!.name }} </b>?
    </span>
    <div class="separator"></div>
    <div class="modal-button-container">
      <Button @click="() => deleteTrack(deleteRequestTrack!)">Yes</Button>
      <Button @click="() => (deleteModalShow = false)">No</Button>
    </div>
  </Modal>
  <Modal @close-request="() => (renameModalShow = false)" title="Rename track" :show="renameModalShow">
    <span v-if="renameRequestTrack !== null">
      Renaming <b>{{ renameRequestTrack!.artist }} - {{ renameRequestTrack!.name }} </b>
    </span>
    <input v-model="renamingTrackArtist" type="text" class="input modal-input" placeholder="Artis" />
    <input v-model="renamingTrackName" type="text" class="input modal-input" placeholder="Track name" />
    <div class="separator"></div>
    <div class="modal-button-container">
      <Button @click="() => renameTrack(renameRequestTrack!, renamingTrackArtist, renamingTrackName)">Save</Button>
      <Button @click="() => (renameModalShow = false)">Cancel</Button>
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
import Button from '@/components/Controls/Button.vue';

const playerStore = usePlayerStore();
playerStore.importTracks(useSettingsStore().getMusicStoragePath());
const tracks = ref<ITrack[]>(playerStore.getTrackList());
const deleteRequestTrack = ref<ITrack | null>(null);
const renameRequestTrack = ref<ITrack | null>(null);
const deleteModalShow = ref(false);
const renameModalShow = ref(false);
const renamingTrackArtist = ref('');
const renamingTrackName = ref('');

function deleteRequestHandle(track: ITrack) {
  deleteRequestTrack.value = track;
  deleteModalShow.value = true;
}

function renameRequestHandle(track: ITrack) {
  renameRequestTrack.value = track;
  renamingTrackArtist.value = track.artist;
  renamingTrackName.value = track.name;
  renameModalShow.value = true;
}

function deleteTrack(track: ITrack) {
  deleteModalShow.value = false;

  if (playerStore.currentTrackId === track.id) {
    playerStore.currentTrackId = null;
  }

  playerStore.deleteTrack(track.id);
  tracks.value = playerStore.getTrackList();
}

function renameTrack(track: ITrack, artist: string, trackName: string) {
  renameModalShow.value = false;

  if (playerStore.currentTrackId === track.id) {
    playerStore.currentTrackId = null;
  }

  playerStore.renameTrack(track.id, artist, trackName);
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

.modal-input {
  min-width: 350px;
}
</style>
