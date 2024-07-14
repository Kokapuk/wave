import { Track } from '@renderer/utils/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type PlayerState = 'playing' | 'paused' | 'buffering';

interface PlayerProxy {
  play(): void;
  pause(): void;
  seekTo(seconds: number): void;
  setVolume(volume: number): void;
}

interface PlayerStore {
  tracks: Track[];
  addTrack(track: Track): void;
  removeTrack(trackId: string): void;
  editTrack(trackId: string, editData: Partial<Pick<Track, 'name' | 'artist'>>);
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
}

const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      tracks: [],
      addTrack: (track) => set({ tracks: [...get().tracks, track] }),
      removeTrack: (trackId: string) => {
        set({
          tracks: get().tracks.filter((i) => i.id !== trackId),
          player: null,
          currentTime: 0,
          currentTrackIndex: null,
          duration: 0,
          playerState: 'paused',
        });
      },
      editTrack: (trackId, editData) => {
        const tracks: Track[] = JSON.parse(JSON.stringify(get().tracks));
        const editingTrack = tracks.find((i) => i.id === trackId);

        if (!editingTrack) {
          return;
        }

        editingTrack.name = editData.name ?? editingTrack.name;
        editingTrack.artist = editData.artist ?? editingTrack.artist;

        set({ tracks });
      },
      currentTrackIndex: null,
      setCurrentTrackIndex: (index) => set({ currentTrackIndex: index, player: null }),
      playPrevious: () => {
        const state = get();

        if (state.currentTrackIndex === null) {
          return;
        }

        if (state.tracks.length < 2) {
          state.player?.seekTo(0);
          state.player?.play();
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

        if (state.currentTrackIndex === null) {
          return;
        }

        if (state.tracks.length < 2) {
          state.player?.seekTo(0);
          state.player?.play();
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
    }),
    {
      name: 'player',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tracks: state.tracks,
        volume: state.volume,
      }),
    }
  )
);

export default usePlayerStore;
