import AbstractView from '../framework/view/abstract-view.js';


function createTripInfoViewTemplate(points, destinations) {
  if (!points || points.length === 0) {
    return '';
  }

  const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

  const cityNames = [];
  const seen = new Set();
  sortedPoints.forEach((point) => {
    const dest = destinations.find((d) => d.id === point.destination);
    if (dest && !seen.has(dest.name)) {
      seen.add(dest.name);
      cityNames.push(dest.name);
    }
  });

  let title = '';
  if (cityNames.length === 1) {
    title = cityNames[0];
  } else if (cityNames.length <= 3) {
    title = cityNames.join(' — ');
  } else {
    title = `${cityNames[0]} — … — ${cityNames.at(-1)}`;
  }


  const price = points.reduce((sum, point) => sum + Number(point.basePrice), 0);

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;

  constructor({points, destinations}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoViewTemplate(this.#points,this.#destinations);
  }
}
