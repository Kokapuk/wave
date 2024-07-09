import Play from '@renderer/icons/Play';
import usePlayerStore from '@renderer/store/playerStore';
import { Track as TrackType } from '@renderer/utils/types';
import cn from 'classnames';
import { useMemo } from 'react';
import styles from './Track.module.scss';

interface Props {
  track: TrackType;
}

const Track = ({ track }: Props) => {
  const { tracks, setCurrentTrackIndex, currentTrackIndex } = usePlayerStore();

  const isPlaying = useMemo(() => {
    if (currentTrackIndex === null) {
      return false;
    }

    return tracks[currentTrackIndex].id === track.id;
  }, [currentTrackIndex, tracks]);

  const handleClick = () => {
    const trackIndex = tracks.findIndex((i) => track.id === i.id);

    if (trackIndex < 0) {
      return;
    }

    setCurrentTrackIndex(trackIndex);
  };

  return (
    <div>
      <button onClick={handleClick} className={styles.playButton}>
        <img className={styles.cover} src={track.cover} alt={track.name} />
        <Play className={styles.icon} />
      </button>
      <div className={cn(styles.details, isPlaying && styles.playing)}>
        <p className={styles.name}>{track.name}</p>
        <p className={styles.artist}>{track.artist}</p>
      </div>
    </div>
  );
};

export default Track;
