import { create } from 'zustand';

export interface YouTubeTrack {
  name: string;
  artist: string;
  videoId: string;
}

interface PlayerProxy {
  play(): void;
  pause(): void;
  seekTo(time: number): void;
  setVolume(volume: number): void;
}

interface PlayerStore {
  tracks: YouTubeTrack[];
  currentTrackIndex: number | null;
  setCurrentTrackIndex(index: number | null): void;
  playPrevious(): void;
  playNext(): void;
  player: PlayerProxy | null;
  setPlayer(player: PlayerProxy | null): void;
  isPlaying: boolean;
  setPlaying(isPlaying: boolean): void;
  currentTime: number;
  setCurrentTime(currentTime: number): void;
  duration: number;
  setDuration(duration: number): void;
  volume: number;
  setVolume(volume): void;
}

const usePlayerStore = create<PlayerStore>()((set, get) => ({
  tracks: [
    { name: 'There is Hope', artist: 'Cool Guy', videoId: 'xG4VDE2X-IU' },
    { name: 'Cyberpunk 2077', artist: 'Cyber Guy', videoId: 'CsnoKc8PKZU' },
    { name: 'September', artist: 'Comfort Guy', videoId: 'DFZ7H6Tt5Rk' },
  ],
  currentTrackIndex: null,
  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),
  playPrevious: () => {
    const state = get();

    if (!state.tracks.length || state.currentTrackIndex === null) {
      return;
    }

    let previousTrackIndex = state.currentTrackIndex - 1;

    if (previousTrackIndex === -1) {
      previousTrackIndex = state.tracks.length - 1;
    }

    set({ currentTrackIndex: previousTrackIndex });
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

    set({ currentTrackIndex: nextTrackIndex });
  },
  player: null,
  setPlayer: (player) => set({ player }),
  isPlaying: false,
  setPlaying: (isPlaying) => set({ isPlaying }),
  currentTime: 0,
  setCurrentTime: (currentTime) => set({ currentTime }),
  duration: 0,
  setDuration: (duration) => set({ duration }),
  volume: 20,
  setVolume: (volume) => set({ volume }),
}));

export default usePlayerStore;
