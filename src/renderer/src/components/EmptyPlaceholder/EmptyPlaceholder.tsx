import { ReactNode } from 'react';
import styles from './EmptyPlaceholder.module.scss';

interface Props {
  title: string;
  caption: ReactNode;
}

const EmptyPlaceholder = ({ title, caption }: Props) => {
  return (
    <div className={styles.placeholder}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.caption}>{caption}</p>
    </div>
  );
};

export default EmptyPlaceholder;
