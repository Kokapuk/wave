import Close from '@renderer/icons/Close';
import cn from 'classnames';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Transition from '../Transition';
import styles from './Modal.module.scss';

interface Props {
  open: boolean;
  onClose?(): void;
  children: ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, children, className }: Props) => {
  return createPortal(
    <Transition display={open} classes={{ enter: styles.enter, exit: styles.exit }}>
      <div className={styles.backdrop} onMouseDown={onClose}>
        <Transition display={open} classes={{ enter: styles.enter, exit: styles.exit }}>
          <div className={cn(styles.modal, className)} onMouseDown={(e) => e.stopPropagation()}>
            {onClose && (
              <button onClick={onClose} className={styles.closeButton}>
                <Close />
              </button>
            )}
            {children}
          </div>
        </Transition>
      </div>
    </Transition>,
    document.getElementById('modalRoot') as HTMLElement
  );
};

export default Modal;
