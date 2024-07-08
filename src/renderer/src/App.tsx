import Layout from './components/Layout';
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
      {currentTrackIndex !== null && <YouTubePlayer videoId={tracks[currentTrackIndex].videoId} />}
    </>
  );
};

export default App;
