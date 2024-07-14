import { Track } from '@renderer/utils/types';
import { useState } from 'react';
import Modal from '../Modal';
import styles from './AddTrackModal.module.scss';
import usePlayerStore from '@renderer/store/playerStore';
import useToastsStore from '@renderer/store/toastsStore';

interface Props {
  track: Track;
  open: boolean;
  onClose(): void;
}

const AddTrackModal = ({ track, open, onClose }: Props) => {
  const [name, setName] = useState(track.name);
  const [artist, setArtist] = useState(track.artist);
  const addTrack = usePlayerStore((st) => st.addTrack);
  const addToast = useToastsStore((st) => st.addToast);

  const addToPlaylist = () => {
    addTrack({ ...track, name: name.trim(), artist: artist.trim() });
    addToast({ message: `${name} has been added to your playlist!`, duration: 5000 });
    onClose();
  };

  return (
    <Modal className={styles.modal} open={open} onClose={onClose}>
      <img className={styles.cover} src={track.cover} alt={name} />
      <div className={styles.form}>
        <div className={styles.inputContainer}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.label}>Artist</p>
          <input
            className={styles.input}
            value={artist}
            onChange={(e) => setArtist(e.currentTarget.value)}
          />
        </div>
        <button onClick={addToPlaylist} className={styles.button}>
          Add to Playlist
        </button>
      </div>
    </Modal>
  );
};

export default AddTrackModal;
