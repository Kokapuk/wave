import { Source, Track } from './types';

const getTrackLink = (track: Track) => {
  const linkTemplates: Record<Source, string> = {
    youtube: 'https://www.youtube.com/watch?v=$',
    soundCloud: 'SC:$',
  };

  return linkTemplates[track.source].replace('$', track.id);
};

export default getTrackLink;
