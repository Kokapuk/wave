import usePlayerStore from '@renderer/store/playerStore';
import { useEffect, useRef } from 'react';
import styles from './SoundCloudPlayer.module.scss';

declare var SC: any;

interface Props {
  trackId: string;
}

const SoundCloudPlayer = ({ trackId }: Props) => {
  const parameters = Object.entries({
    auto_play: false,
    buying: false,
    sharing: false,
    download: false,
    show_artwork: false,
    show_playcount: false,
    show_user: false,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const frame = useRef<HTMLIFrameElement>(null);
  const { setPlayer, setPlayerState, setCurrentTime, setDuration, playNext } = usePlayerStore();

  useEffect(() => {
    const handleReady = (widget: any) => {
      setPlayer({
        play: () => widget.play(),
        pause: () => widget.pause(),
        seekTo: (seconds) => widget.seekTo(seconds * 1000),
        setVolume: (volume) => widget.setVolume(volume),
      });

      widget.getDuration((milliseconds) => setDuration(milliseconds / 1000));
      setTimeout(() => widget.play());
    };

    const handleFinish = () => {
      setPlayerState('paused');
      playNext();
    };

    let widget;

    (async () => {
      if (typeof SC === 'undefined') {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://w.soundcloud.com/player/api.js';
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }

      if (!frame.current) {
        return;
      }

      widget = SC.Widget(frame.current);
      widget.bind(SC.Widget.Events.PLAY, () => setPlayerState('playing'));
      widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => setCurrentTime(data.currentPosition / 1000));
      widget.bind(SC.Widget.Events.PAUSE, () => setPlayerState('paused'));
      widget.bind(SC.Widget.Events.FINISH, handleFinish);
      widget.bind(SC.Widget.Events.READY, () => handleReady(widget));
    })();

    return () =>
      [
        SC.Widget.Events.PLAY,
        SC.Widget.Events.PLAY_PROGRESS,
        SC.Widget.Events.PAUSE,
        SC.Widget.Events.FINISH,
        SC.Widget.Events.READY,
      ].forEach(widget.unbind);
  }, [trackId]);

  return (
    <iframe
      key={trackId}
      ref={frame}
      className={styles.embed}
      width="100%"
      height="166"
      allow="autoplay"
      src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}?${parameters}`}
    />
  );
};

export default SoundCloudPlayer;
