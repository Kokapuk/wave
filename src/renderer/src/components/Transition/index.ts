export { default } from './Transition';

export interface Classes {
  enter: string;
  exit: string;
}

export type TransitionState = keyof Classes;
