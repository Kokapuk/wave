import { defineStore } from 'pinia';
const { app } = require('@electron/remote');
const path = require('path');

export const useSettingsStore = defineStore('settings', () => {
  const defaultMusicStoragePath = path.join(app.getPath('userData'), 'music');
  const defaultVolume = 0.5;

  function setMusicStoragePath(path: string) {
    localStorage.setItem('settings:music-storage-path', path);
  }

  function getMusicStoragePath(): string {
    let musicStoragePath = localStorage.getItem('settings:music-storage-path');
    musicStoragePath = musicStoragePath !== null ? musicStoragePath : defaultMusicStoragePath;

    return musicStoragePath as string;
  }

  function setVolume(volume: number) {
    localStorage.setItem('settings:volume', JSON.stringify(volume));
  }

  function getVolume(): number {
    const storageVolume: null | string = localStorage.getItem('settings:volume');

    return storageVolume === null ? defaultVolume : JSON.parse(storageVolume);
  }

  return { defaultMusicStoragePath, defaultVolume, setMusicStoragePath, getMusicStoragePath, setVolume, getVolume };
});
