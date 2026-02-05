const AUTHORIZATION = 'Basic hfgr4757583jsa';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};
const POINTS_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DEFAULT: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const SORT_ITEMS = [
  { type: SortType.DEFAULT, checked: true },
  { type: SortType.EVENT, disabled: true },
  { type: SortType.TIME},
  { type: SortType.PRICE },
  { type: SortType.OFFERS, disabled: true },
];


const DATE_FORMATS = {
  taskDate: 'MMM D',
  attributeDate: 'YYYY-MM-DD',
  taskTime: 'HH:mm',
  fullDate: 'DD/MM/YY HH:mm',
  attributeFullDate: 'YYYY-MM-DDTHH:mm',
  tripInfoDate: 'D MMM',
};

const UserAction = {
  EDIT_POINT: 'EDIT_POINT',
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const ApiRoute = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers'
};


export {AUTHORIZATION, END_POINT, POINTS_TYPES, EMPTY_POINT, FilterType, Mode, SortType, SORT_ITEMS, DATE_FORMATS, UserAction, UpdateType, TimeLimit, Method, ApiRoute };
