import EmptyPlaceholder from '@renderer/components/EmptyPlaceholder';
import Track from '@renderer/components/Track';
import useViewTransitionState from '@renderer/hooks/useViewTransitionState';
import SoundCloud from '@renderer/icons/SoundCloud';
import YouTube from '@renderer/icons/YouTube';
import usePlayerStore from '@renderer/store/playerStore';
import styles from './Home.module.scss';

const Home = () => {
  const originalTracks = usePlayerStore((st) => st.tracks);
  const [tracks, isTransitioning] = useViewTransitionState(originalTracks);

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
        <li style={{ viewTransitionName: isTransitioning ? `track-${i.id}` : 'none' }} key={i.id}>
          <Track track={i} />
        </li>
      ))}
    </ul>
  );
};

export default Home;
