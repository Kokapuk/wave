import Close from '@renderer/icons/Close';
import cn from 'classnames';
import { ReactNode, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import styles from './Modal.module.scss';

interface Props {
  open: boolean;
  onClose?(): void;
  children: ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, children, className }: Props) => {
  const backdrop = useRef<HTMLDivElement>(null);
  const [transitionState, setTransitionState] = useState<'enter' | 'exit'>(open ? 'enter' : 'exit');

  return createPortal(
    <CSSTransition
      in={open}
      timeout={200}
      nodeRef={backdrop}
      classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive,
      }}
      unmountOnExit
      onEnter={() => setTransitionState('enter')}
      onExit={() => setTransitionState('exit')}
    >
      <div ref={backdrop} className={styles.backdrop} onMouseDown={onClose}>
        <div className={cn(styles.modal, className, styles[transitionState])} onMouseDown={(e) => e.stopPropagation()}>
          {onClose && (
            <button onClick={onClose} className={styles.closeButton}>
              <Close />
            </button>
          )}
          {children}
        </div>
      </div>
    </CSSTransition>,
    document.getElementById('modalRoot') as HTMLElement
  );
};

export default Modal;
