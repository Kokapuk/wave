export const enum TooltipPositioning {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

export interface ITrack {
  id: string;
  audio: string;
  cover: string;
  name: string;
  artist: string;
}

export interface ISpotifyToken {
  token: string;
  expires: number;
}

export interface ITrackPlaybackRate {
  trackId: string;
  playbackRate: number;
}
