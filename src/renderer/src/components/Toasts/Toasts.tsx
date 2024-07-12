import useToastsStore from '@renderer/store/toastsStore';
import { createPortal } from 'react-dom';
import Toast from '../Toast';
import styles from './Toasts.module.scss';

const Toasts = () => {
  const { toasts } = useToastsStore();
  return createPortal(
    <div className={styles.container}>
      {toasts.map((i) => (
        <Toast key={i.id} toast={i} />
      ))}
    </div>,
    document.getElementById('toastsRoot') as HTMLElement
  );
};

export default Toasts;
