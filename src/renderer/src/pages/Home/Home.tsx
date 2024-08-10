import EmptyPlaceholder from '@renderer/components/EmptyPlaceholder';
import LayoutTransition from '@renderer/components/LayoutTransition';
import Track from '@renderer/components/Track';
import useDelayedState from '@renderer/hooks/useDelayedState';
import SoundCloud from '@renderer/icons/SoundCloud';
import YouTube from '@renderer/icons/YouTube';
import usePlayerStore from '@renderer/store/playerStore';
import styles from './Home.module.scss';
import SwitchTransition from '@renderer/components/SwitchTransition';

const Home = () => {
  const originalTracks = usePlayerStore((st) => st.tracks);
  const [tracks] = useDelayedState(originalTracks, true);

  return (
    <ul className={styles.grid}>
      <SwitchTransition
        classes={{
          enter: styles.enter,
          exit: styles.exit,
        }}
        timeout={200}
      >
        {!tracks.delayed.length && (
          <div className={styles.placeholderTransition}>
            <EmptyPlaceholder
              title="Your playlist appears to be empty"
              caption={
                <>
                  Use <YouTube className={styles.icon} /> or <SoundCloud className={styles.icon} /> to find and add
                  tracks to the playlist
                </>
              }
            />
          </div>
        )}
      </SwitchTransition>
      {tracks.delayed.map((i) => (
        <LayoutTransition key={i.id} deps={[tracks.relevant]} delayedDeps={[tracks.delayed]} duration={200}>
          <li>
            <Track track={i} />
          </li>
        </LayoutTransition>
      ))}
    </ul>
  );
};

export default Home;
