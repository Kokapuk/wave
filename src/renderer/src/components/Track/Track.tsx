import Ellipsis from '@renderer/icons/Ellipsis';
import Pause from '@renderer/icons/Pause';
import Play from '@renderer/icons/Play';
import usePlayerStore from '@renderer/store/playerStore';
import { Track as TrackType } from '@renderer/utils/types';
import cn from 'classnames';
import { HTMLProps, useMemo } from 'react';
import TrackMenu from '../TrackMenu';
import styles from './Track.module.scss';

interface Props {
  track: TrackType;
}

const Track = ({ track, ...props }: Props & Pick<HTMLProps<HTMLDivElement>, 'onContextMenu'>) => {
  const { tracks, setCurrentTrackIndex, currentTrackIndex, player, playerState } = usePlayerStore();

  const isPlaying = useMemo(() => {
    if (currentTrackIndex === null) {
      return false;
    }

    return tracks[currentTrackIndex].id === track.id;
  }, [currentTrackIndex, tracks]);

  const handleClick = () => {
    if (tracks[currentTrackIndex ?? -1]?.id === track.id) {
      ({ playing: player?.pause, paused: player?.play })[playerState]?.();
      return;
    }

    const trackIndex = tracks.findIndex((i) => track.id === i.id);

    if (trackIndex < 0) {
      return;
    }

    setCurrentTrackIndex(trackIndex);
  };

  return (
    <div {...props} className={styles.container}>
      <div className={styles.coverContainer}>
        <img className={styles.cover} src={track.cover} alt={track.name} loading="lazy" />
        <button onClick={handleClick} className={styles.playButton}>
          {tracks[currentTrackIndex ?? -1]?.id !== track.id || playerState === 'paused' ? (
            <Play className={styles.icon} />
          ) : (
            <Pause className={styles.icon} />
          )}
        </button>
        <TrackMenu track={track}>
          <button className={styles.moreButton}>
            <Ellipsis />
          </button>
        </TrackMenu>
      </div>
      <div className={cn(styles.details, isPlaying && styles.playing)}>
        <p className={styles.name} title={track.name}>
          {track.name}
        </p>
        <p className={styles.artist} title={track.artist}>
          {track.artist}
        </p>
      </div>
    </div>
  );
};

export default Track;
