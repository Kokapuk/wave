import Layout from './components/Layout';
import SoundCloudPlayer from './components/SoundCloudPlayer';
import TrackGrid from './components/TrackGrid';
import YouTubePlayer from './components/YouTubePlayer/YouTubePlayer';
import usePlayerStore from './store/playerStore';

const App = () => {
  const { tracks, currentTrackIndex } = usePlayerStore();

  return (
    <>
      <Layout>
        <TrackGrid />
      </Layout>
      {currentTrackIndex !== null && tracks[currentTrackIndex].source === 'youtube' && (
        <YouTubePlayer videoId={tracks[currentTrackIndex].id} />
      )}
      {currentTrackIndex !== null && tracks[currentTrackIndex].source === 'soundCloud' && (
        <SoundCloudPlayer trackId={tracks[currentTrackIndex].id} />
      )}
    </>
  );
};

export default App;
