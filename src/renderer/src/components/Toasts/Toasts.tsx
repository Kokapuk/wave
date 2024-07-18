import useToastsStore from '@renderer/store/toastsStore';
import { createPortal } from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Toast from '../Toast';
import toastStyles from '../Toast/Toast.module.scss';
import styles from './Toasts.module.scss';

const Toasts = () => {
  const { toasts } = useToastsStore();
  return createPortal(
    <TransitionGroup className={styles.container}>
      {toasts.map((i) => (
        <CSSTransition
          key={i.id}
          timeout={200}
          classNames={{
            enter: toastStyles.enter,
            enterActive: toastStyles.enterActive,
            exit: toastStyles.exit,
            exitActive: toastStyles.exitActive,
          }}
        >
          <Toast toast={i} />
        </CSSTransition>
      ))}
    </TransitionGroup>,
    document.getElementById('toastsRoot') as HTMLElement
  );
};

export default Toasts;
