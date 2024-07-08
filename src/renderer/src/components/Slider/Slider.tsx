import snapToStep from '@renderer/utils/snapToStep';
import cn from 'classnames';
import { HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Slider.module.scss';

type Props = {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  fillClass?: string;
  thumbClass?: string;
} & (
  | {
      value?: undefined;
      onChange?: undefined;
    }
  | {
      value: number;
      onChange(value: number): void;
    }
) &
  Omit<HTMLProps<HTMLDivElement>, 'tabIndex' | 'aria-disabled' | 'onChange' | 'onInput'>;

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  onChange,
  disabled,
  fillClass,
  thumbClass,
  ...props
}: Props) => {
  const isSliding = useRef(false);
  const track = useRef<HTMLDivElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(min);
  const value = useMemo(() => controlledValue ?? uncontrolledValue, [controlledValue, uncontrolledValue]);
  const setValue = useMemo(() => onChange ?? setUncontrolledValue, [onChange, setUncontrolledValue]);

  const getProgressByMouseX = (mouseX: number) => {
    if (!track.current) {
      return;
    }

    const trackRect = track.current.getBoundingClientRect();
    const rawProgress = ((mouseX - trackRect.left) / trackRect.width) * (max - min) + min;
    const snappedProgress = snapToStep(rawProgress, step);
    const clampedProgress = Math.max(Math.min(snappedProgress, max), min);

    return clampedProgress;
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isSliding.current) {
        return;
      }

      setValue(getProgressByMouseX(event.clientX) ?? min);
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
  }, [max, min]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    props.onMouseDown?.(event);

    if (disabled) {
      return;
    }

    event.preventDefault();
    event.currentTarget.focus();

    setValue(getProgressByMouseX(event.clientX) ?? min);
    isSliding.current = true;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    props.onKeyDown?.(event);

    switch (event.key) {
      case 'ArrowLeft':
        setValue(Math.max(Math.min(value - step, max), min));
        break;
      case 'ArrowRight':
        setValue(Math.max(Math.min(value + step, max), min));
        break;
    }
  };

  return (
    <div
      {...props}
      ref={track}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={cn(styles.track, props.className)}
      aria-disabled={disabled}
    >
      <div style={{ width: `${((value - min) / (max - min)) * 100}%` }} className={cn(styles.fill, fillClass)}>
        <div className={cn(styles.thumb, thumbClass)} />
      </div>
    </div>
  );
};

export default Slider;
