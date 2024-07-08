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
import Slider from '../Slider';
import LoadingSpinner from '../LoadingSpinner';
import Speaker from '@renderer/icons/Speaker';
import SpeakerMuted from '@renderer/icons/SpeakerMuted';

dayjs.extend(duration);

const formatDuration = (time: number): string => dayjs.duration(time * 1000).format(`${time > 3600 ? 'HH:' : ''}mm:ss`);

const Controls = () => {
  const {
    player,
    currentTime,
    duration,
    playerState,
    volume,
    setVolume,
    playPrevious,
    playNext,
    isMuted,
    setMuted,
    currentTrackIndex,
    tracks,
  } = usePlayerStore();
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

  useEffect(() => {
    if (!player) {
      return;
    }

    isMuted ? player.mute() : player.unmute();
  }, [player, isMuted]);

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);
    setMuted(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        {currentTrackIndex !== null && (
          <>
            <img
              className={styles.cover}
              src={tracks[currentTrackIndex].cover}
              width={56}
              height={56}
            />
            <div>
              <p className={styles.name}>{tracks[currentTrackIndex].name}</p>
              <p className={styles.artist}>{tracks[currentTrackIndex].artist}</p>
            </div>
          </>
        )}
      </div>

      <div className={styles.playback}>
        <div className={styles.buttons}>
          <button disabled={!player} onClick={playPrevious} className={styles.button}>
            <Backward />
          </button>
          <button
            onClick={{ playing: player?.pause, paused: player?.play }[playerState]}
            className={cn(styles.button, styles.play)}
            disabled={!player}
          >
            {playerState === 'playing' && <Pause />}
            {playerState === 'paused' && <Play />}
            {playerState === 'buffering' && <LoadingSpinner className={styles.loadingSpinner} />}
          </button>

          <button disabled={!player} onClick={playNext} className={styles.button}>
            <Forward />
          </button>
        </div>

        <div className={styles.timeline}>
          <p className={styles.time}>{formatDuration(isSeeking ? seekingTimeValue : currentTime)}</p>

          <Slider
            onChange={setSeekingTimeValue}
            onMouseDown={() => setSeeking(true)}
            min={0}
            max={duration}
            step={1}
            value={isSeeking ? seekingTimeValue : currentTime}
            disabled={!player}
          />

          <p className={styles.time}>{formatDuration(duration)}</p>
        </div>
      </div>

      <div className={styles.volume}>
        <button onClick={() => setMuted(!isMuted)} className={styles.button}>
          {isMuted ? <SpeakerMuted /> : <Speaker />}
        </button>
        <Slider
          className={styles.slider}
          min={0}
          max={100}
          step={1}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default Controls;
