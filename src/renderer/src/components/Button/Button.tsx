import useDelayedState from '@renderer/hooks/useDelayedState';
import cn from 'classnames';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import SwitchTransition from '../SwitchTransition';
import styles from './Button.module.scss';

interface Props {
  loading?: boolean;
}

const Button = ({
  loading,
  ...props
}: Props & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  const [isLoading] = useDelayedState(loading ?? false, true);

  return (
    <button {...props} className={cn(styles.button, props.className)}>
      <SwitchTransition classes={{ enter: styles.enter, exit: styles.exit }} timeout={200}>
        {isLoading.relevant && (
          <div className={styles.loadingSpinnerContainer}>
            <LoadingSpinner />
          </div>
        )}
      </SwitchTransition>
      {props.children}
    </button>
  );
};

export default Button;
