import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ITrack } from '@/types';

export const usePlayerStore = defineStore('player', () => {
  const title = ref('Your Library');
  const currentTrackId = ref<number | null>(null);
  const audioIsPaused = ref(true);
  const audioDuration = ref(0);
  const audioCurrentTime = ref(0);
  const audioVolume = ref(0.05);

  function getTrackList(): ITrack[] {
    // let tracks = localStorage.getItem('tracks');

    // if (tracks === null) return [];
    // else return JSON.parse(tracks);
    return [
      {
        id: 0,
        audio: 'https://muzek.net/uploads/music/2020/05/Antoha_MS_Uspej_poznat.mp3',
        cover: 'https://images.genius.com/58689fe94ab0e6641c81f97e1b965f2b.1000x1000x1.jpg',
        name: 'Успей познать',
        author: 'Антоха МС',
      },
      {
        id: 1,
        audio: 'https://mezzoforte.ru/s/artist/301730-george_michael_last_christmas.mp3',
        cover: 'https://cdns-images.dzcdn.net/images/cover/02a714c827c267c60b3d3d99ab4499a4/500x500.jpg',
        name: 'Last Christmas',
        author: 'Wham!',
      },
    ];
  }

  return { title, currentTrackId, audioIsPaused, audioDuration, audioCurrentTime, audioVolume, getTrackList };
});
