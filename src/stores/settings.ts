import { defineStore } from 'pinia';
const { app } = require('@electron/remote');
const path = require('path');

export const useSettingsStore = defineStore('settings', () => {
  const defaultMusicStoragePath = path.join(app.getPath('userData'), 'music');

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

    return storageVolume === null ? 0.5 : JSON.parse(storageVolume);
  }

  function setMaximized(maximized: boolean) {
    localStorage.setItem('settings:maximized', JSON.stringify(maximized));
  }

  function getMaximized(): boolean {
    const storageMaximized: null | string = localStorage.getItem('settings:maximized');

    return storageMaximized === null ? false : JSON.parse(storageMaximized);
  }

  return { defaultMusicStoragePath, setMusicStoragePath, getMusicStoragePath, setVolume, getVolume, setMaximized, getMaximized };
});
