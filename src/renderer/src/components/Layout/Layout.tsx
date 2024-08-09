import usePlayerStore from '@renderer/store/playerStore';
import { Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import Controls from '../Controls';
import SoundCloudPlayer from '../SoundCloudPlayer';
import SwitchTransition from '../SwitchTransition';
import TitleBar from '../TitleBar';
import YouTubePlayer from '../YouTubePlayer';
import styles from './Layout.module.scss';

const Layout = () => {
  const { tracks, currentTrackIndex } = usePlayerStore();
  const location = useLocation();
  const currentOutlet = useOutlet();

  return (
    <>
      <div className={styles.wrapper}>
        <TitleBar />
        <div className={styles.pageContainer}>
          <Suspense>
            <SwitchTransition
              classes={{
                enter: styles.enter,
                exit: styles.exit,
              }}
              timeout={200}
              mode="in-out"
              freeSpaceOnExit
            >
              <div key={location.pathname} className={styles.transitionWrapper}>
                {currentOutlet}
              </div>
            </SwitchTransition>
          </Suspense>
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
