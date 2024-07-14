import Link from '@renderer/icons/Link';
import Pen from '@renderer/icons/Pen';
import Trash from '@renderer/icons/Trash';
import usePlayerStore from '@renderer/store/playerStore';
import useToastsStore from '@renderer/store/toastsStore';
import getTrackLink from '@renderer/utils/getTrackLink';
import { Track } from '@renderer/utils/types';
import { useState } from 'react';
import Menu, { MenuProps } from '../Menu';
import TrackModal from '../TrackModal';

interface Props {
  children: MenuProps['children'];
  track: Track;
}

const TrackMenu = ({ children, track }: Props) => {
  const addToast = useToastsStore((st) => st.addToast);
  const { removeTrack, editTrack } = usePlayerStore();
  const [isEditing, setEditing] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(getTrackLink(track));
    addToast({ message: 'Link copied!', duration: 3500 });
  };

  const remove = () => {
    removeTrack(track.id);
    addToast({ message: `${track.name} was removed from playlist!`, duration: 5000 });
  };

  const handleSave = (track: Track) => {
    editTrack(track.id, track);
    addToast({ message: 'Track was edited!', duration: 3500 });
  };

  return (
    <>
      <Menu
        menu={[
          {
            label: 'Copy link',
            icon: <Link />,
            onClick: copyLink,
          },
          {
            label: 'Edit',
            icon: <Pen />,
            onClick: () => setEditing(true),
          },
          {
            label: 'Remove',
            icon: <Trash />,
            onClick: remove,
          },
        ]}
        children={children}
      />
      <TrackModal
        track={track}
        open={isEditing}
        onClose={() => setEditing(false)}
        onSubmit={handleSave}
        buttonLabel="Save"
      />
    </>
  );
};

export default TrackMenu;
