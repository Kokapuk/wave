import { defineStore } from 'pinia';
import type { ISpotifyToken, ITrackPlaybackRate } from '../types';
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
    localStorage.setItem('saved:spotify-token', JSON.stringify(token));
  }

  function getSpotifyToken(): ISpotifyToken | null {
    let storageToken = localStorage.getItem('saved:spotify-token');
    if (storageToken === null) return null;

    let parsedToken: ISpotifyToken = JSON.parse(storageToken);
    if (Date.now() > parsedToken.expires) return null;

    return parsedToken;
  }

  function setVolumeHotkeysEnabled(enabled: boolean) {
    localStorage.setItem('settings:volume-hotkeys-enabled', JSON.stringify(enabled));
  }

  function getVolumeHotkeysEnabled(): boolean {
    let storageEnabled = localStorage.getItem('settings:volume-hotkeys-enabled');

    if (storageEnabled === null) return true;
    return JSON.parse(storageEnabled);
  }

  function setTrackPlaybackRate(trackPlaybackRate: ITrackPlaybackRate) {
    let storageTracksPlaybackRate = localStorage.getItem('saved:tracks-playback-rate');

    if (storageTracksPlaybackRate === null) {
      localStorage.setItem('saved:tracks-playback-rate', JSON.stringify([trackPlaybackRate]));
      return;
    }

    let trackPlaybackRateList: ITrackPlaybackRate[] = JSON.parse(storageTracksPlaybackRate);

    if (trackPlaybackRateList.some((item) => item.trackId === trackPlaybackRate.trackId)) {
      trackPlaybackRateList = trackPlaybackRateList.filter((item) => item.trackId !== trackPlaybackRate.trackId);
    }

    trackPlaybackRateList.push(trackPlaybackRate);

    localStorage.setItem('saved:tracks-playback-rate', JSON.stringify(trackPlaybackRateList));
  }

  function getTrackPlaybackRate(trackId: string): number {
    let storageTracksPlaybackRate = localStorage.getItem('saved:tracks-playback-rate');

    if (storageTracksPlaybackRate === null) {
      return 1;
    }

    let trackPlaybackRateList: ITrackPlaybackRate[] = JSON.parse(storageTracksPlaybackRate);

    if (!trackPlaybackRateList.some((item) => item.trackId === trackId)) {
      return 1;
    }

    return trackPlaybackRateList.find((item) => item.trackId === trackId)!.playbackRate;
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
    setVolumeHotkeysEnabled,
    getVolumeHotkeysEnabled,
    setTrackPlaybackRate,
    getTrackPlaybackRate,
  };
});
