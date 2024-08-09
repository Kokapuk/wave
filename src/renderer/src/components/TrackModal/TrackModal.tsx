import { Track } from '@renderer/utils/types';
import { useEffect, useState } from 'react';
import Button from '../Button';
import Modal from '../Modal';
import styles from './TrackModal.module.scss';

interface Props {
  track: Track;
  open: boolean;
  onClose(): void;
  onSubmit(track: Track): void;
  buttonLabel: string;
}

const TrackModal = ({ track, open, onClose, onSubmit, buttonLabel }: Props) => {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(track.name);
    setArtist(track.artist);
  }, [open]);

  const handleSubmit = () => {
    onSubmit({ ...track, name: name.trim(), artist: artist.trim() });
    onClose();
  };

  return (
    <Modal className={styles.modal} open={open} onClose={onClose}>
      <img className={styles.cover} src={track.cover} alt={name} />
      <div className={styles.form}>
        <div className={styles.inputContainer}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} value={name} onChange={(e) => setName(e.currentTarget.value)} />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.label}>Artist</p>
          <input className={styles.input} value={artist} onChange={(e) => setArtist(e.currentTarget.value)} />
        </div>
        <Button onClick={handleSubmit}>{buttonLabel}</Button>
      </div>
    </Modal>
  );
};

export default TrackModal;
