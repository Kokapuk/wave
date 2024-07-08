import { YouTubeTrack } from '@renderer/store/playerStore';
import styles from './Track.module.scss';

interface Props {
  track: YouTubeTrack;
}

const Track = ({ track }: Props) => {
  return (
    <div className={styles.container}>
      <img
        className={styles.cover}
        src="https://marketplace.canva.com/EAF00PkmbGU/1/0/1600w/canva-red-and-yellow-modern-rap-music-music-album-cover-IqU7hAqANz4.jpg"
        alt={track.name}
        width={275}
        height={275}
      />
      <p className={styles.name}>{track.name}</p>
      <p className={styles.artist}>{track.artist}</p>
    </div>
  );
};

export default Track;
