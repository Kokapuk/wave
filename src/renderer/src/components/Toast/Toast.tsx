import { Toast as ToastType } from '@renderer/utils/types';
import cn from 'classnames';
import { HTMLProps } from 'react';
import styles from './Toast.module.scss';

interface Props {
  toast: ToastType;
}

const Toast = ({ toast, ...props }: Props & HTMLProps<HTMLDivElement>) => {
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
    <div {...props} className={cn(styles.toast, props.className)}>
      {toast.message}
      <div ref={handleToastProgressRender} className={styles.progress} />
    </div>
  );
};

export default Toast;
