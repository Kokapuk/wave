import { defineStore } from 'pinia';
const { app } = require('@electron/remote');
const path = require('path');

export const useSettingsStore = defineStore('settings', () => {
  function getMusicStoragePath(): string {
    let musicStoragePath = localStorage.getItem('settings:music-storage-path');
    musicStoragePath = musicStoragePath !== null ? musicStoragePath : path.join(app.getPath('userData'), 'music');

    return musicStoragePath as string;
  }

  function setMusicStoragePath(path: string) {
    localStorage.setItem('settings:music-storage-path', path);
  }

  return { getMusicStoragePath, setMusicStoragePath };
});
