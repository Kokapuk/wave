import Backward from '@renderer/icons/Backward';
import Forward from '@renderer/icons/Forward';
import Pause from '@renderer/icons/Pause';
import Play from '@renderer/icons/Play';
import usePlayerStore from '@renderer/store/playerStore';
import cn from 'classnames';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';
import styles from './Controls.module.scss';

dayjs.extend(duration);

const formatDuration = (time: number): string => dayjs.duration(time * 1000).format(`${time > 3600 ? 'HH:' : ''}mm:ss`);

const Controls = () => {
  const { player, currentTime, duration, isPlaying, volume, setVolume, playPrevious, playNext } = usePlayerStore();
  const [isSeeking, setSeeking] = useState(false);
  const [seekingTimeValue, setSeekingTimeValue] = useState(0);

  useEffect(() => {
    const handleMouseUp = () => {
      if (!isSeeking || !player) {
        return;
      }

      player.seekTo(seekingTimeValue);
      setTimeout(() => setSeeking(false), 100);
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isSeeking, seekingTimeValue]);

  useEffect(() => {
    if (!player) {
      return;
    }

    player.setVolume(volume);
  }, [player, volume]);

  return (
    <div className={styles.container}>
      {/* <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(e.currentTarget.valueAsNumber)} />
      <p>{volume}%</p>
      <input
        onMouseDown={() => setSeeking(true)}
        type="range"
        min={0}
        max={duration}
        value={isSeeking ? seekingTimeValue : currentTime}
        onInput={(e) => setSeekingTimeValue(e.currentTarget.valueAsNumber)}
        disabled={!player}
      />
      <p>
        {formatDuration(isSeeking ? seekingTimeValue : currentTime)}/{formatDuration(duration)}
      </p> */}
      <div className={styles.track} />
      <div className={styles.playback}>
        <div className={styles.buttons}>
          <button disabled={!player} onClick={playPrevious} className={styles.button}>
            <Backward />
          </button>
          <button
            onClick={() => (isPlaying ? player?.pause() : player?.play())}
            className={cn(styles.button, styles.play)}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button disabled={!player} onClick={playNext} className={styles.button}>
            <Forward />
          </button>
        </div>
      </div>
      <div className={styles.volume} />
    </div>
  );
};

export default Controls;
