import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ITrack } from '@/types';
import { useSettingsStore } from './settings';
const fs = require('fs');
const path = require('path');

export const usePlayerStore = defineStore('player', () => {
  const title = ref('');
  const currentTrackId = ref<string | null>(null);
  const audioIsPaused = ref(true);
  const audioDuration = ref(0);
  const audioCurrentTime = ref(0);
  const audioVolume = ref(0.03);

  function getTrackList(): ITrack[] {
    let tracks = localStorage.getItem('tracks');

    if (tracks === null) return [];
    else return JSON.parse(tracks);

    // return [
    //   {
    //     id: '0',
    //     audio: 'https://muzek.net/uploads/music/2020/05/Antoha_MS_Uspej_poznat.mp3',
    //     cover: 'https://images.genius.com/58689fe94ab0e6641c81f97e1b965f2b.1000x1000x1.jpg',
    //     name: 'Успей познать',
    //     author: 'Антоха МС',
    //   },
    //   {
    //     id: '1',
    //     audio: 'https://mezzoforte.ru/s/artist/301730-george_michael_last_christmas.mp3',
    //     cover: 'https://cdns-images.dzcdn.net/images/cover/02a714c827c267c60b3d3d99ab4499a4/500x500.jpg',
    //     name: 'Last Christmas',
    //     author: 'Wham!',
    //   },
    // ];
  }

  function setTrackList(tracks: ITrack[]) {
    localStorage.setItem('tracks', JSON.stringify(tracks));
    fs.writeFileSync(path.join(useSettingsStore().getMusicStoragePath(), 'import-data.json'), JSON.stringify(tracks));
  }

  function clearTrackList() {
    localStorage.removeItem('tracks');
    fs.writeFileSync(path.join(useSettingsStore().getMusicStoragePath(), 'import-data.json'), '[]');
  }

  function deleteTrack(id: string) {
    setTrackList(getTrackList().filter((item) => item.id !== id));

    fs.rmSync(path.join(useSettingsStore().getMusicStoragePath(), id), { recursive: true, force: true });
  }

  function getTrackById(id: string): ITrack {
    const tracks = getTrackList();

    return tracks.find((item) => item.id === id)!;
  }

  function getPreviousTrack(id: string): ITrack {
    const tracks = getTrackList();
    let previousTrack: ITrack | undefined = undefined;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];

      if (track.id !== id) continue;
      previousTrack = tracks.at(i - 1);
    }

    return previousTrack!;
  }

  function getNextTrack(id: string): ITrack {
    const tracks = getTrackList();
    let nextTrack: ITrack;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];

      if (track.id !== id) continue;
      let nextTrackId = i + 1;

      if (nextTrackId >= tracks.length) {
        nextTrackId -= tracks.length;
      }

      nextTrack = tracks[nextTrackId];
    }

    return nextTrack!;
  }

  return {
    title,
    currentTrackId,
    audioIsPaused,
    audioDuration,
    audioCurrentTime,
    audioVolume,
    getTrackList,
    setTrackList,
    clearTrackList,
    deleteTrack,
    getTrackById,
    getPreviousTrack,
    getNextTrack,
  };
});
