
import { Rate } from '../types';
import styles from './Graph.module.scss';
import dayjs from 'dayjs'

export default function Graph({rates}: {rates: Rate[]}) {

  const fromDate = dayjs(rates[0].date);
  const toDate = dayjs(rates.slice(-1)[0].date);
  const totalDays = toDate.diff(fromDate, 'day');

  const dayXDelta = 400 / totalDays;
  const weekDayOffset = (fromDate.day() + 1) % 7;

  let daysXSet = [];
  for(let i = 0; i < totalDays; i++) {
    daysXSet.push(i * dayXDelta);
  }

  let weekendXSet = [];
  for(let i = 0; i < 4; i++) {
    weekendXSet.push((weekDayOffset * dayXDelta) + (7 * i * dayXDelta));
  }
  
  const minValue = rates.reduce((acc, cur) => Math.min(acc, cur.value), Infinity);
  const maxValue = rates.reduce((acc, cur) => Math.max(acc, cur.value), 0);
  const range = maxValue - minValue;

  let dataLineSet = [];
  for(let data of rates) {
    const daysSinceFrom = dayjs(data.date).diff(fromDate, 'day');
    const x = 50 + daysSinceFrom * dayXDelta
    const y = 150 - (data.value - minValue) / (range / 100);
    dataLineSet.push({x, y});
  }

  const dataLineDef = dataLineSet.reduce((acc, cur) => {
    const prefix = acc === '' ? 'M ' : ' L ';
    return `${acc}${prefix}${cur.x},${cur.y}`;
  }, '');

  return (
    <svg viewBox='0 0 450 250' className={styles.graph}>
      <path className={styles.dataLine} d={dataLineDef} /> {/* data line */}
      {weekendXSet.map((x, i) => (
        <path key={i} className={styles.weekend} d={`M ${x + 50},0 L ${x + 50},200`} /> /* dashed vertical */
      ))}
      {daysXSet.map((x, i) => (
        <path key={i} className={styles.day} d={`M ${x + 50},0 L ${x + 50},200`} /> /* dashed vertical */
      ))}

      <path className={styles.minLimit} d='M 30,150 L 450,150' /> {/* horizontal MIN limit */}
      <path className={styles.maxLimit} d='M 30,50 L 450,50' /> {/* horizontal MAX limit */}

      <path d='M 50,0 L 50,200' /> {/* vertical axis */}
      <path d='M 50,200 L 450,200' /> {/* horizontal axis */}
      <path className={styles.border} d='M 450,0 L 450,200' /> {/* vertical right border */}
      <path className={styles.border} d='M 50,0 L 450,0' /> {/* horizontal top border */}
    </svg>
  )
}