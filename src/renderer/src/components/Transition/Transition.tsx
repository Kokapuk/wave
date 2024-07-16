import cn from 'classnames';
import { cloneElement, HTMLProps, ReactElement, useEffect, useState } from 'react';
import { Classes, TransitionState } from '.';

interface Props {
  display: boolean;
  children: ReactElement<HTMLProps<HTMLElement>>;
  classes: Classes;
}

const Transition = ({ display, children, classes }: Props) => {
  const [render, setRender] = useState(false);
  const [transitionState, setTransitionState] = useState<TransitionState>('exit');

  useEffect(() => {
    if (!display) {
      setTransitionState('exit');
      return;
    }

    setRender(true);
    setTimeout(() => {
      setTransitionState('enter');
    }, 10);
  }, [display]);

  if (!render) {
    return null;
  }

  return cloneElement(children, {
    className: cn(children.props.className, classes[transitionState]),
    onTransitionEnd: (e) => {
      children.props.onTransitionEnd?.(e);

      if (display) {
        return;
      }

      setRender(false);
    },
  });
};

export default Transition;
