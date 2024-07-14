import Track from '@renderer/components/Track';
import SoundCloud from '@renderer/icons/SoundCloud';
import YouTube from '@renderer/icons/YouTube';
import usePlayerStore from '@renderer/store/playerStore';
import styles from './Home.module.scss';
import EmptyPlaceholder from '@renderer/components/EmptyPlaceholder';

const Home = () => {
  const tracks = usePlayerStore((st) => st.tracks);

  return (
    <ul className={styles.grid}>
      {!tracks.length && (
        <EmptyPlaceholder
          title="Your playlist appears to be empty"
          caption={
            <>
              Use <YouTube className={styles.icon} /> or <SoundCloud className={styles.icon} /> to find and add tracks
              to the playlist
            </>
          }
        />
      )}
      {tracks.map((i) => (
        <li key={i.id}>
          <Track track={i} />
        </li>
      ))}
    </ul>
  );
};

export default Home;
