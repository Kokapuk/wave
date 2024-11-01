import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default (time: number): string => {
  const hourInSeconds = 3600;

  return dayjs.duration(time, 's').format(`${time > hourInSeconds ? 'HH:' : ''}mm:ss`);
};
