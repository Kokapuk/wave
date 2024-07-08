import usePlayerStore from '@renderer/store/playerStore';
import { useRef } from 'react';
import YouTube from 'react-youtube';
import { PlayerState } from '.';

interface Props {
  videoId: string;
}

const YouTubePlayer = ({ videoId }: Props) => {
  const { setPlayer, setPlaying, setCurrentTime, setDuration, playNext } = usePlayerStore();
  const currentTimeCheckInterval = useRef<number | null>(null);

  const handleReady = (event) => {
    currentTimeCheckInterval.current && clearInterval(currentTimeCheckInterval.current);

    setPlayer({
      play: () => event.target.playVideo(),
      pause: () => event.target.pauseVideo(),
      seekTo: (time) => event.target.seekTo(time),
      setVolume: (volume) => event.target.setVolume(volume),
    });

    setDuration(event.target.getDuration());

    currentTimeCheckInterval.current = setInterval(() => {
      setCurrentTime(event.target.getCurrentTime());
    }, 100) as unknown as number;
  };

  const handleStateChange = (event) => {
    if (event.data === PlayerState.Playing || event.data === PlayerState.Buffering) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }

    if (event.data === PlayerState.Ended) {
      playNext();
    }
  };

  return (
    <YouTube
      onReady={handleReady}
      onStateChange={handleStateChange}
      videoId={videoId}
      opts={{ playerVars: { autoplay: 1, iv_load_policy: 3 } }}
    />
  );
};

export default YouTubePlayer;
