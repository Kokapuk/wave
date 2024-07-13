import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';
import Close from '@renderer/icons/Close';
import { ReactNode } from 'react';
import cn from 'classnames';

interface Props {
  open: boolean;
  onClose?(): void;
  children: ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, children, className }: Props) => {
  if (!open) {
    return null;
  }

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={cn(styles.modal, className)} onMouseDown={(e) => e.stopPropagation()}>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            <Close />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.getElementById('modalRoot') as HTMLElement
  );
};

export default Modal;
