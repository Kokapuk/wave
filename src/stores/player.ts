import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ITrack } from '@/types';
import { useSettingsStore } from './settings';
import { uid } from 'uid';
const fs = require('fs');
const path = require('path');
const Downloader = require('nodejs-file-downloader');

export const usePlayerStore = defineStore('player', () => {
  const title = ref('');
  const currentTrackId = ref<string | null>(null);
  const audioIsPaused = ref(true);
  const audioDuration = ref(0);
  const audioCurrentTime = ref(0);
  const audioVolume = ref(0.03);
  const audioMuted = ref(false);
  const audioLoop = ref(false);

  function getTrackList(): ITrack[] {
    let tracks = localStorage.getItem('tracks');

    if (tracks === null) return [];
    else return JSON.parse(tracks);
  }

  function setTrackList(tracks: ITrack[]) {
    localStorage.setItem('tracks', JSON.stringify(tracks));

    fs.writeFileSync(
      path.join(useSettingsStore().getMusicStoragePath(), 'import-data.json'),
      JSON.stringify(tracks).replaceAll(useSettingsStore().getMusicStoragePath().replaceAll('\\', '\\\\') + '\\\\', '')
    );
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

  function importTracks(importPath: string) {
    let tracks: ITrack[] = JSON.parse(fs.readFileSync(path.join(importPath, 'import-data.json')));

    tracks.map((item) => {
      item.audio = path.join(importPath, item.audio);
      item.cover = path.join(importPath, item.cover);
    });

    usePlayerStore().setTrackList(tracks);
  }

  async function downloadTrack(track: ITrack, progressChange: (percentage: number) => void) {
    const trackId = uid(12);
    const trackPath = path.join(useSettingsStore().getMusicStoragePath(), trackId);
    let downloadSuccesfull = true;

    let downloader = new Downloader({
      url: track.audio,
      directory: trackPath,
      onProgress: progressChange,
    });

    try {
      const { filePath } = await downloader.download();

      fs.copyFileSync(filePath, path.join(trackPath, 'audio.mp3'));
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log('Audio download failed', error);
      downloadSuccesfull = false;
    }

    downloader = new Downloader({
      url: track.cover,
      directory: trackPath,
      onProgress: progressChange,
    });

    try {
      const { filePath } = await downloader.download();

      fs.copyFileSync(filePath, path.join(trackPath, 'cover.png'));
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log('Cover download failed', error);
      downloadSuccesfull = false;
    }

    if (downloadSuccesfull) {
      const downloadedTrack: ITrack = {
        id: trackId,
        audio: path.join(trackPath, 'audio.mp3'),
        cover: path.join(trackPath, 'cover.png'),
        name: track.name,
        artist: track.artist,
      };

      usePlayerStore().setTrackList([downloadedTrack, ...usePlayerStore().getTrackList()]);
    }
  }

  return {
    title,
    currentTrackId,
    audioIsPaused,
    audioDuration,
    audioCurrentTime,
    audioVolume,
    audioMuted,
    audioLoop,
    getTrackList,
    setTrackList,
    clearTrackList,
    deleteTrack,
    getTrackById,
    getPreviousTrack,
    getNextTrack,
    importTracks,
    downloadTrack,
  };
});
