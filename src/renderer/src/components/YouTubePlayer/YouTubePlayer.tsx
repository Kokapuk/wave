import usePlayerStore from '@renderer/store/playerStore';
import { useRef } from 'react';
import YouTube from 'react-youtube';
import { PlayerState } from '.';
import styles from './YouTubePlayer.module.scss';

interface Props {
  videoId: string;
}

const YouTubePlayer = ({ videoId }: Props) => {
  const { setPlayer, setPlayerState, setCurrentTime, setDuration, playNext } = usePlayerStore();
  const currentTimeCheckInterval = useRef<number | null>(null);

  const handleReady = (event) => {
    currentTimeCheckInterval.current && clearInterval(currentTimeCheckInterval.current);

    setPlayer({
      play: () => event.target.playVideo(),
      pause: () => event.target.pauseVideo(),
      seekTo: (time) => event.target.seekTo(time),
      setVolume: (volume) => event.target.setVolume(volume),
      mute: () => event.target.mute(),
      unmute: () => event.target.unMute(),
    });

    setDuration(event.target.getDuration());

    currentTimeCheckInterval.current = setInterval(() => {
      setCurrentTime(event.target.getCurrentTime());
    }, 100) as unknown as number;
  };

  const handleStateChange = (event) => {
    switch (event.data) {
      case PlayerState.Playing:
        setPlayerState('playing');
        break;
      case PlayerState.Paused:
      case PlayerState.Ended:
        setPlayerState('paused');
        break;
      case PlayerState.Buffering:
        setPlayerState('buffering');
        break;
    }

    if (event.data === PlayerState.Ended) {
      playNext();
    }
  };

  return (
    <YouTube
      className={styles.embed}
      onReady={handleReady}
      onStateChange={handleStateChange}
      videoId={videoId}
      opts={{ width: 200, height: 200, playerVars: { autoplay: 1, iv_load_policy: 3 } }}
    />
  );
};

export default YouTubePlayer;
