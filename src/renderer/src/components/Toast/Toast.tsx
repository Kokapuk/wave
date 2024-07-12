import { Toast as ToastType } from '@renderer/utils/types';
import styles from './Toast.module.scss';

interface Props {
  toast: ToastType;
}

const Toast = ({ toast }: Props) => {
  const handleToastProgressRender = (node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }

    setTimeout(() => {
      node.style.transitionDuration = `${toast.duration}ms`;
      node.style.width = '0';
    }, 10);
  };

  return (
    <div className={styles.toast}>
      {toast.message}
      <div ref={handleToastProgressRender} className={styles.progress} />
    </div>
  );
};

export default Toast;
