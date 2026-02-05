import AbstractView from '../framework/view/abstract-view.js';
import { createElement } from '../framework/render.js';
import { formatDate } from '../utils/point.js';

const MIN_CITY = 1;
const MAX_CITY = 3;

const getRouteTitle = (points, destinations) => {
  if (!points || points.length === 0) {
    return 'No events';
  }

  const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

  const cityNames = [];
  const seen = new Set();

  sortedPoints.forEach((point) => {
    const dest = destinations.find((d) => d.id === point.destination);
    if (dest?.name && !seen.has(dest.name)) {
      seen.add(dest.name);
      cityNames.push(dest.name);
    }
  });

  if (cityNames.length === MIN_CITY) {
    return cityNames[0];
  }

  if (cityNames.length <= MAX_CITY) {
    return cityNames.join(' — ');
  }

  return `${cityNames[0]}  …  ${cityNames[cityNames.length - 1]}`;
};


const getTripDates = (points) => {

  const start = points[0]?.dateFrom;
  const end = points[points.length - 1]?.dateTo;

  if (!start || !end) {
    return '—';
  }

  const startStr = formatDate(start, 'tripInfoDate');
  const endStr = formatDate(end, 'tripInfoDate');

  return startStr === endStr ? startStr : `${startStr} — ${endStr}`;
};

const getTotalPrice = (points, getSelectedOffers) => points.reduce((total, point) => {
  let pointCost = Number(point.basePrice) || 0;

  const selectedOffers = getSelectedOffers(point.type, point.offers || []);

  if (selectedOffers?.length) {
    pointCost += selectedOffers.reduce((sum, offer) => sum + (Number(offer.price) || 0), 0);
  }

  return total + pointCost;
}, 0);


const createTripInfoViewTemplate = (points, destinations, getSelectedOffers) => {
  const title = getRouteTitle(points, destinations);
  const dates = getTripDates(points);
  const total = getTotalPrice(points, getSelectedOffers);

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
      </p>
    </section>
  `;
};

export default class TripInfoView extends AbstractView {
  #points = [];
  #destinations = [];
  #getSelectedOffers = null;

  constructor({ points = [], destinations = [], getSelectedOffers }) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#getSelectedOffers = getSelectedOffers;
  }

  get template() {
    return createTripInfoViewTemplate(
      this.#points,
      this.#destinations,
      this.#getSelectedOffers
    );
  }

  update({ points, destinations, getSelectedOffers }) {
    this.#points = points || this.#points;
    this.#destinations = destinations || this.#destinations;
    this.#getSelectedOffers = getSelectedOffers || this.#getSelectedOffers;

    const prevElement = this.element;
    this.element = createElement(this.template);
    prevElement.replaceWith(this.element);
  }
}
