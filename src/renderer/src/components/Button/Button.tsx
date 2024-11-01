import cn from 'classnames';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import styles from './Button.module.scss';

interface Props {
  loading?: boolean;
}

const Button = ({
  loading,
  ...props
}: Props & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  return (
    <button {...props} className={cn(styles.button, props.className)}>
      {loading && (
        <div className={styles.loadingSpinnerContainer}>
          <LoadingSpinner />
        </div>
      )}
      {props.children}
    </button>
  );
};

export default Button;
