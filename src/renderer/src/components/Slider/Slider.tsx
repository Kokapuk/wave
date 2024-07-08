import snapToStep from '@renderer/utils/snapToStep';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Slider.module.scss';

type Props = {
  min?: number;
  max?: number;
  step?: number;
} & (
  | {
      value?: undefined;
      onChange?: undefined;
    }
  | {
      value: number;
      onChange(value: number): void;
    }
);

const Slider = ({ min = 0, max = 1, step = 0.01, value: controlledValue, onChange }: Props) => {
  const isSliding = useRef(false);
  const track = useRef<HTMLDivElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(min);
  const value = useMemo(() => controlledValue ?? uncontrolledValue, [controlledValue, uncontrolledValue]);
  const setValue = useMemo(() => onChange ?? setUncontrolledValue, [onChange, setUncontrolledValue]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isSliding.current || !track.current) {
        return;
      }

      const trackRect = track.current.getBoundingClientRect();
      const rawProgress = ((event.clientX - trackRect.left) / trackRect.width) * (max - min) + min;
      const snappedProgress = snapToStep(rawProgress, step);
      const clampedProgress = Math.max(Math.min(snappedProgress, max), min);

      setValue(clampedProgress);
    };

    const handleMouseUp = () => {
      isSliding.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();

    isSliding.current = true;
  };

  return (
    <div ref={track} onMouseDown={handleMouseDown} tabIndex={0} className={styles.track}>
      <div style={{ width: `${((value - min) / (max - min)) * 100}%` }} className={styles.fill}>
        <div className={styles.thumb} />
      </div>
    </div>
  );
};

export default Slider;
