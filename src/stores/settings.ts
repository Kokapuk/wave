import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', () => {
  function getMusicStoragePath(): string | null {
    return localStorage.getItem('settings:music-storage-path');
  }

  function setMusicStoragePath(path: string) {
    localStorage.setItem('settings:music-storage-path', path);
  }

  return { getMusicStoragePath, setMusicStoragePath };
});
