import Play from '@renderer/icons/Play';
import usePlayerStore, { YouTubeTrack } from '@renderer/store/playerStore';
import styles from './Track.module.scss';

interface Props {
  track: YouTubeTrack;
}

const Track = ({ track }: Props) => {
  const { tracks, setCurrentTrackIndex } = usePlayerStore();

  const handleClick = () => {
    const trackIndex = tracks.findIndex((i) => track.videoId === i.videoId);

    if (trackIndex < 0) {
      return;
    }

    setCurrentTrackIndex(trackIndex);
  };

  return (
    <div className={styles.container}>
      <button onClick={handleClick} className={styles.playButton}>
        <img className={styles.cover} src={track.cover} alt={track.name} />
        <Play className={styles.icon} />
      </button>
      <p className={styles.name}>{track.name}</p>
      <p className={styles.artist}>{track.artist}</p>
    </div>
  );
};

export default Track;
