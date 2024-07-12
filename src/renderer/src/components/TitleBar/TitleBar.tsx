import Tabs from '../Tabs';
import styles from './TitleBar.module.scss';

const TitleBar = () => {
  return (
    <div className={styles.titleBar}>
      <Tabs />
    </div>
  );
};

export default TitleBar;
