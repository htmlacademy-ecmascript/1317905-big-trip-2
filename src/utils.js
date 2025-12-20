import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';

function humanizeTaskDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function humanizeTaskTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
}

function humanizeFullDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(FULL_DATE_FORMAT) : '';
}


function humanizePointDuration(dateFrom, dateTo) {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);

  const diffInMinutes = end.diff(start, 'minute');
  const dur = dayjs.duration(diffInMinutes, 'minutes');

  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();

  const parts = [];

  if (days > 0) {
    parts.push(`${String(days).padStart(2, '0')}D`);
  }


  if (days > 0 || hours > 0) {
    parts.push(`${String(hours).padStart(2, '0')}H`);
  }


  parts.push(`${String(minutes).padStart(2, '0')}M`);

  return parts.join(' ');
}


export {humanizeTaskDate, humanizeTaskTime, humanizeFullDate, humanizePointDuration};

