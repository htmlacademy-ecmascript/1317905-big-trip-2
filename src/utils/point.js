import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {DATE_FORMATS} from '../const.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


function formatDate(date, formatKey = 'taskDate') {
  if (!date) {
    return '';
  }
  return dayjs(date).format(DATE_FORMATS[formatKey]);
}


function humanizePointDuration(dateFrom, dateTo) {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const diffInMinutes = end.diff(start, 'minute');
  const dur = dayjs.duration(diffInMinutes, 'minutes');

  const parts = [];
  if (dur.days() > 0) {
    parts.push(`${dur.days().toString().padStart(2, '0')}D`);
  }
  if (dur.days() > 0 || dur.hours() > 0) {
    parts.push(`${dur.hours().toString().padStart(2, '0')}H`);
  }
  parts.push(`${dur.minutes().toString().padStart(2, '0')}M`);

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

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {formatDate, humanizePointDuration, isFuture, isPast, isPresent, updateItem};

