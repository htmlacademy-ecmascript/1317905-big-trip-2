import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const DATE_FORMAT = 'D MMMM';
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
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const dur = dayjs.duration(diff);

  return dur.format('DD[D] HH[H] mm[M]');
}

export {humanizeTaskDate, humanizeTaskTime, humanizeFullDate, humanizePointDuration};

