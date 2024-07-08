import usePlayerStore from '@renderer/store/playerStore';
import Track from '../Track';
import styles from './TrackGrid.module.scss';

const TrackGrid = () => {
  const tracks = usePlayerStore((st) => st.tracks);

  return (
    <ul className={styles.grid}>
      {tracks.map((i) => (
        <li key={i.videoId}>
          <Track track={i} />
        </li>
      ))}
      {tracks.map((i) => (
        <li key={i.videoId}>
          <Track track={i} />
        </li>
      ))}
      {tracks.map((i) => (
        <li key={i.videoId}>
          <Track track={i} />
        </li>
      ))}
      {tracks.map((i) => (
        <li key={i.videoId}>
          <Track track={i} />
        </li>
      ))}
    </ul>
  );
};

export default TrackGrid;
