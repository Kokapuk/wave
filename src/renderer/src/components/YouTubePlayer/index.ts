export { default } from './YouTubePlayer';

export const enum PlayerState {
  'Unstarted' = -1,
  'Ended',
  'Playing',
  'Paused',
  'Buffering',
  'Cued' = 5,
}
