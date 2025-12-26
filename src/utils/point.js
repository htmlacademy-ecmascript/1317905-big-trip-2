import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(relativeTime);

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const DATE_FORMAT = 'MMM D';
const DATE_ATTRIBUTE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';
const FULL_DATE_ATTRIBUTE_FORMAT = 'YYYY-MM-DDTHH:mm';

function humanizeTaskDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function humanizeAttributeDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_ATTRIBUTE_FORMAT) : '';
}

function humanizeTaskTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
}

function humanizeFullDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(FULL_DATE_FORMAT) : '';
}

function humanizeAttributeFullDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(FULL_DATE_ATTRIBUTE_FORMAT) : '';
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


const isFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());

const isPast = (point) => dayjs(point.dateTo).isBefore(dayjs());

const isPresent = (point) => {
  const now = dayjs();
  const start = dayjs(point.dateFrom);
  const end = dayjs(point.dateTo);

  return start.isSameOrBefore(now) && end.isSameOrAfter(now);
};

export {humanizeTaskDate, humanizeTaskTime, humanizeFullDate, humanizeAttributeFullDate, humanizeAttributeDate,humanizePointDuration, isFuture, isPast, isPresent};

