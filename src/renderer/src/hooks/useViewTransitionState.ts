import { SetStateAction, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

type SetViewTransitionStateAction<T> = (state: SetStateAction<T>, skipTransition?: boolean) => void;

const useViewTransitionState = <T>(
  originalState: T,
  set?: boolean
): [T, boolean] | [T, boolean, SetViewTransitionStateAction<T>] => {
  const [state, setState] = useState(originalState);
  const [isTransitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (set || state === originalState) {
      return;
    }

    setTransitioning(true);

    setTimeout(async () => {
      const transition = document.startViewTransition(() => {
        flushSync(() => setState(originalState));
      });

      await transition.finished;
      setTransitioning(false);
    });
  }, [set, originalState]);

  if (set) {
    const setViewTransitionState: SetViewTransitionStateAction<T> = (newState, skipTransition) => {
      if (skipTransition) {
        setState(newState);
        return;
      }

      setTransitioning(true);

      setTimeout(async () => {
        const transition = document.startViewTransition(() => {
          flushSync(() => setState(newState));
        });

        await transition.finished;
        setTransitioning(false);
      });
    };

    return [state, isTransitioning, setViewTransitionState];
  }

  return [state, isTransitioning];
};

export default useViewTransitionState;
