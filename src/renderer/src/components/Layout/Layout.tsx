import usePlayerStore from '@renderer/store/playerStore';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Controls from '../Controls';
import SoundCloudPlayer from '../SoundCloudPlayer';
import TitleBar from '../TitleBar';
import YouTubePlayer from '../YouTubePlayer';
import styles from './Layout.module.scss';

const Layout = () => {
  const { tracks, currentTrackIndex } = usePlayerStore();

  return (
    <>
      <div className={styles.wrapper}>
        <TitleBar />
        <div className={styles.pageContainer}>
          <div className={styles.transitionWrapper}>
            <Suspense>
              <Outlet />
            </Suspense>
          </div>
        </div>
        <Controls />
      </div>

      {currentTrackIndex !== null && tracks[currentTrackIndex].source === 'youtube' && (
        <YouTubePlayer videoId={tracks[currentTrackIndex].id} />
      )}
      {currentTrackIndex !== null && tracks[currentTrackIndex].source === 'soundCloud' && (
        <SoundCloudPlayer trackId={tracks[currentTrackIndex].id} />
      )}
    </>
  );
};

export default Layout;
