import { ReactNode } from 'react';
import styles from './Layout.module.scss';
import Controls from '../Controls';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.pageContainer}>{children}</div>
      <Controls />
    </div>
  );
};

export default Layout;
