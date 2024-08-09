import Close from '@renderer/icons/Close';
import cn from 'classnames';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import SwitchTransition from '../SwitchTransition';
import styles from './Modal.module.scss';

interface Props {
  open: boolean;
  onClose?(): void;
  children: ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, children, className }: Props) => {
  return createPortal(
    <div className={styles.container}>
      <SwitchTransition
        classes={{
          enter: styles.enter,
          exit: styles.exit,
        }}
        timeout={200}
      >
        {open && <div className={styles.backdrop} onMouseDown={onClose} />}
      </SwitchTransition>
      <SwitchTransition
        classes={{
          enter: styles.enter,
          exit: styles.exit,
        }}
        timeout={200}
      >
        {open && (
          <div className={cn(styles.modal, className)} onMouseDown={(e) => e.stopPropagation()}>
            {onClose && (
              <button onClick={onClose} className={styles.closeButton}>
                <Close />
              </button>
            )}
            {children}
          </div>
        )}
      </SwitchTransition>
    </div>,
    document.getElementById('modalRoot') as HTMLElement
  );
};

export default Modal;
