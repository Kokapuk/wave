import Track from '@renderer/components/Track';
import usePlayerStore from '@renderer/store/playerStore';
import styles from './Home.module.scss';

const Home = () => {
  const tracks = usePlayerStore((st) => st.tracks);

  return (
    <ul className={styles.grid}>
      {tracks.map((i) => (
        <li key={i.id}>
          <Track track={i} />
        </li>
      ))}
    </ul>
  );
};

export default Home;
