export type Source = 'youtube' | 'soundCloud';

export interface Track {
  source: Source;
  id: string;
  name: string;
  artist: string;
  cover: string;
}
