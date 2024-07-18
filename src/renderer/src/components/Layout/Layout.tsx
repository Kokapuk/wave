import usePlayerStore from '@renderer/store/playerStore';
import { Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Controls from '../Controls';
import SoundCloudPlayer from '../SoundCloudPlayer';
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
        <Suspense>
          <SwitchTransition>
            <CSSTransition
              key={location.pathname}
              timeout={200}
              classNames={{
                enter: styles.enter,
                enterActive: styles.enterActive,
                exit: styles.exit,
                exitActive: styles.exitActive,
              }}
              unmountOnExit
            >
              <div className={styles.pageContainer}>{currentOutlet}</div>
            </CSSTransition>
          </SwitchTransition>
        </Suspense>
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
