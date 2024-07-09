import { Track } from '@renderer/utils/types';
import { create } from 'zustand';

export type PlayerState = 'playing' | 'paused' | 'buffering';

interface PlayerProxy {
  play(): void;
  pause(): void;
  seekTo(seconds: number): void;
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
}

interface PlayerStore {
  tracks: Track[];
  currentTrackIndex: number | null;
  setCurrentTrackIndex(index: number | null): void;
  playPrevious(): void;
  playNext(): void;
  player: PlayerProxy | null;
  setPlayer(player: PlayerProxy | null): void;
  playerState: PlayerState;
  setPlayerState(state: PlayerState): void;
  currentTime: number;
  setCurrentTime(currentTime: number): void;
  duration: number;
  setDuration(duration: number): void;
  volume: number;
  setVolume(volume): void;
  isMuted: boolean;
  setMuted(isMuted: boolean): void;
}

const usePlayerStore = create<PlayerStore>()((set, get) => ({
  tracks: [
    {
      source: 'youtube',
      id: 'xG4VDE2X-IU',
      name: 'There is Hope',
      artist: 'Cool Guy',
      cover:
        'https://marketplace.canva.com/EAF00PkmbGU/1/0/1600w/canva-red-and-yellow-modern-rap-music-music-album-cover-IqU7hAqANz4.jpg',
    },
    {
      source: 'soundCloud',
      id: '1466020975',
      name: 'Fortnite',
      artist: 'Chill Guy',
      cover: 'https://i1.sndcdn.com/artworks-Na4lwZ6WaQdXse9P-v9WH0A-t500x500.jpg',
    },
    {
      source: 'soundCloud',
      id: '1395939625',
      name: 'Cooked Grind',
      artist: 'Cooked Guy',
      cover: 'https://i1.sndcdn.com/artworks-hGJ44C1zqWqegfyv-PZ7zfg-t500x500.jpg',
    },
    {
      name: 'Cyberpunk 2077',
      source: 'youtube',
      id: 'CsnoKc8PKZU',
      artist: 'Cyber Guy',
      cover: 'https://www.upbeatgeek.com/wp-content/uploads/2024/02/The_E.N.D._cover-300x300.jpg',
    },
    {
      source: 'youtube',
      id: 'DFZ7H6Tt5Rk',
      name: 'September',
      artist: 'Comfort Guy',
      cover:
        'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/285655006/original/387a272c04f43c1f364d43e556883b0907c83a85/design-unique-music-album-cover-art.jpg',
    },
  ],
  currentTrackIndex: null,
  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index, player: null }),
  playPrevious: () => {
    const state = get();

    if (!state.tracks.length || state.currentTrackIndex === null) {
      return;
    }

    let previousTrackIndex = state.currentTrackIndex - 1;

    if (previousTrackIndex === -1) {
      previousTrackIndex = state.tracks.length - 1;
    }

    set({ currentTrackIndex: previousTrackIndex, player: null });
  },
  playNext: () => {
    const state = get();

    if (!state.tracks.length || state.currentTrackIndex === null) {
      return;
    }

    let nextTrackIndex = state.currentTrackIndex + 1;

    if (nextTrackIndex === state.tracks.length) {
      nextTrackIndex = 0;
    }

    set({ currentTrackIndex: nextTrackIndex, player: null });
  },
  player: null,
  setPlayer: (player) => set({ player }),
  playerState: 'paused',
  setPlayerState: (state) => set({ playerState: state }),
  currentTime: 0,
  setCurrentTime: (currentTime) => set({ currentTime }),
  duration: 0,
  setDuration: (duration) => set({ duration }),
  volume: 20,
  setVolume: (volume) => set({ volume }),
  isMuted: false,
  setMuted: (isMuted) => set({ isMuted }),
}));

export default usePlayerStore;