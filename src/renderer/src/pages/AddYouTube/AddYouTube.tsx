import usePlayerStore from '@renderer/store/playerStore';
import useToastsStore from '@renderer/store/toastsStore';
import { WebviewTag } from 'electron';
import { useEffect, useRef } from 'react';
import styles from './AddYouTube.module.scss';

const AddYouTube = () => {
  const webview = useRef<WebviewTag>(null);
  const { addToast } = useToastsStore();

  useEffect(() => {
    if (!webview.current) {
      return;
    }

    const handleIpcMessage = (event: any) => {
      if (event.channel !== 'addToPlaylist' || !event.args.length) {
        return;
      }

      const videoId = event.args[0].match(/https:\/\/(www\.)?youtube\.com\/watch\?v=([^?]+)/)[2];

      if (usePlayerStore.getState().tracks.some((i) => i.id === videoId)) {
        addToast({ message: `${event.args[1]} is already in your playlist!`, duration: 5000 });
        return;
      }

      usePlayerStore.getState().addTrack({
        source: 'youtube',
        id: videoId,
        name: event.args[1],
        artist: event.args[2],
        cover: event.args[3],
      });

      addToast({ message: `${event.args[1]} has been added to your playlist!`, duration: 5000 });
    };

    webview.current.addEventListener('ipc-message', handleIpcMessage);

    const savedWebview = webview.current;

    return () => {
      savedWebview.removeEventListener('ipc-message', handleIpcMessage);
    };
  }, []);

  return (
    <webview
      ref={webview}
      webpreferences="contextIsolation=false"
      className={styles.webview}
      src="https://www.youtube.com/results?search_query="
    />
  );
};

export default AddYouTube;
