import EmptyPlaceholder from '@renderer/components/EmptyPlaceholder';
import Track from '@renderer/components/Track';
import Add from '@renderer/icons/Add';
import usePlayerStore from '@renderer/store/playerStore';
import styles from './Home.module.scss';

const Home = () => {
  const tracks = usePlayerStore((st) => st.tracks);

  return (
    <ul className={styles.grid}>
      {!tracks.length && (
        <EmptyPlaceholder
          title="Your playlist appears to be empty"
          caption={
            <>
              Use <Add /> add tracks to the playlist
            </>
          }
        />
      )}
      {tracks.map((i) => (
        <li>
          <Track track={i} />
        </li>
      ))}
    </ul>
  );
};

export default Home;
