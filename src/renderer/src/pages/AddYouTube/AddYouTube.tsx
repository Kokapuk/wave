import AddTrackModal from '@renderer/components/AddTrackModal';
import usePlayerStore from '@renderer/store/playerStore';
import useToastsStore from '@renderer/store/toastsStore';
import { Track } from '@renderer/utils/types';
import { WebviewTag } from 'electron';
import { useEffect, useRef, useState } from 'react';
import styles from './AddYouTube.module.scss';

const AddYouTube = () => {
  const webview = useRef<WebviewTag>(null);
  const { addToast } = useToastsStore();
  const [addingTrack, setAddingTrack] = useState<{ open: boolean; track: Track | null }>({ open: false, track: null });

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

      setAddingTrack({
        open: true,
        track: {
          source: 'youtube',
          id: videoId,
          name: event.args[1],
          artist: event.args[2],
          cover: event.args[3],
        },
      });
    };

    webview.current.addEventListener('ipc-message', handleIpcMessage);

    const savedWebview = webview.current;

    return () => {
      savedWebview.removeEventListener('ipc-message', handleIpcMessage);
    };
  }, []);

  return (
    <>
      <webview
        ref={webview}
        webpreferences="contextIsolation=false"
        className={styles.webview}
        src="https://www.youtube.com/results?search_query="
      />
      {addingTrack.track && (
        <AddTrackModal
          key={addingTrack.track.id}
          track={addingTrack.track}
          open={addingTrack.open}
          onClose={() => setAddingTrack((prev) => ({ ...prev, open: false }))}
        />
      )}
    </>
  );
};

export default AddYouTube;
