import Close from '@renderer/icons/Close';
import cn from 'classnames';
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

interface Props {
  open: boolean;
  onClose?(): void;
  children: ReactNode;
  className?: string;
}

const posMultiplier = 0.3;

const Modal = ({ open, onClose, children, className }: Props) => {
  const [initialPos, setInitialPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const modal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    setInitialPos({ x: cursorPos.x - window.innerWidth / 2, y: cursorPos.y - window.innerHeight / 2 });
  }, [open]);

  return createPortal(
    <div className={styles.container}>
      {open && <div className={styles.backdrop} onMouseDown={onClose} />}
      {open && (
        <div
          ref={modal}
          className={cn(styles.modal, className)}
          onMouseDown={(e) => e.stopPropagation()}
          style={
            {
              '--initial-translate': `translate(${initialPos.x * posMultiplier}px, ${initialPos.y * posMultiplier}px)`,
            } as CSSProperties
          }
        >
          {onClose && (
            <button onClick={onClose} className={styles.closeButton}>
              <Close />
            </button>
          )}
          {children}
        </div>
      )}
    </div>,
    document.getElementById('modalRoot') as HTMLElement
  );
};

export default Modal;
