import { defineStore } from 'pinia';
import type { ISpotifyToken } from '../types';
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

  function setSpotifyToken(token: ISpotifyToken) {
    localStorage.setItem('settings:spotify-token', JSON.stringify(token));
  }

  function getSpotifyToken(): ISpotifyToken | null {
    let storageToken = localStorage.getItem('settings:spotify-token');
    if (storageToken === null) return null;

    let parsedToken: ISpotifyToken = JSON.parse(storageToken);
    if (Date.now() > parsedToken.expires) return null;

    return parsedToken;
  }

  return {
    defaultMusicStoragePath,
    setMusicStoragePath,
    getMusicStoragePath,
    setVolume,
    getVolume,
    setMaximized,
    getMaximized,
    setSpotifyToken,
    getSpotifyToken,
  };
});
