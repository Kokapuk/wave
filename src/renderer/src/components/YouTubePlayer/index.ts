export { default } from './YTPlayer';

export const enum PlayerState {
  'Unstarted' = -1,
  'Ended',
  'Playing',
  'Paused',
  'Buffering',
  'Cued' = 5,
}
