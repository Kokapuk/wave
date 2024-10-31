import Tabs from '../Tabs';
import styles from './TitleBar.module.scss';

const TitleBar = () => {
  return (
    <div className={styles.titleBar}>
      <div className={styles.safeArea}>
        <Tabs />
      </div>
    </div>
  );
};

export default TitleBar;
