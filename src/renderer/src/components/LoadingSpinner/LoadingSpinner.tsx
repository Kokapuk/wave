import cn from 'classnames';
import styles from './LoadingSpinner.module.scss';

interface Props {
  className?: string;
}

const LoadingSpinner = ({ className }: Props) => {
  return <div className={cn(styles.spinner, className)} />;
};

export default LoadingSpinner;
