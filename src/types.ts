export const enum TooltipPositioning {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

export interface ITrack {
  id: number;
  audio: string;
  cover: string;
  name: string;
  author: string;
}
