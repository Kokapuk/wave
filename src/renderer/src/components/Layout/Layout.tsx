import { ReactNode } from 'react';
import Controls from '../Controls';
import TitleBar from '../TitleBar';
import styles from './Layout.module.scss';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className={styles.wrapper}>
      <TitleBar />
      <div className={styles.pageContainer}>{children}</div>
      <Controls />
    </div>
  );
};

export default Layout;
