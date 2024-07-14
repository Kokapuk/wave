import Link from '@renderer/icons/Link';
import Pen from '@renderer/icons/Pen';
import Trash from '@renderer/icons/Trash';
import usePlayerStore from '@renderer/store/playerStore';
import useToastsStore from '@renderer/store/toastsStore';
import getTrackLink from '@renderer/utils/getLinkFromTrack';
import { Track } from '@renderer/utils/types';
import Menu, { MenuProps } from '../Menu';

interface Props {
  children: MenuProps['children'];
  track: Track;
}

const TrackMenu = ({ children, track }: Props) => {
  const addToast = useToastsStore((st) => st.addToast);
  const removeTrack = usePlayerStore((st) => st.removeTrack);

  const copyLink = () => {
    navigator.clipboard.writeText(getTrackLink(track));
    addToast({ message: 'Link has been copied!', duration: 3500 });
  };

  const remove = () => {
    removeTrack(track.id);
    addToast({ message: `${track.name} has been removed from playlist!`, duration: 5000 });
  };

  return (
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
          onClick: () => {},
          disabled: true,
        },
        {
          label: 'Remove',
          icon: <Trash />,
          onClick: remove,
        },
      ]}
      children={children}
    />
  );
};

export default TrackMenu;
