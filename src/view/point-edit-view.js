import AbstractView from '../framework/view/abstract-view.js';
import { formatDate } from '../utils/point.js';
import { POINTS_TYPES } from '../const.js';


function createTypeListTemplate(type, currentType, id) {
  const isChecked = type === currentType ? 'checked' : '';
  return `
    <div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
      <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${id}">
        ${type[0].toUpperCase() + type.slice(1)}
      </label>
    </div>`;
}


function createOfferTemplate(offer, selectedOfferIds) {
  const { id, title, price } = offer;
  const isChecked = selectedOfferIds.includes(id) ? 'checked' : '';

  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
             id="event-offer-${id}"
             type="checkbox"
             name="event-offer-${id}"
             ${isChecked}>
      <label class="event__offer-label" for="event-offer-${id}">
        <span class="event__offer-title">${title}</span>
        +€&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`;
}

function createOfferListTemplate (offers, checkedOffers) {
  if (offers.length > 0) {
    return ` <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                     ${offers.map((offer) => createOfferTemplate(offer, checkedOffers)).join('')}
                  </section>`;
  }
  return '';
}


function createPictureTemplate (picture) {
  const { src, description } = picture;
  return ` <img class="event__photo" src="${src}" alt="${description}"> `;
}

function createPhotoContainerTemplate (pictures) {
  if (pictures.length > 0) {
    return (`<div class="event__photos-container">
                      <div class="event__photos-tape">
                       ${pictures.map((picture) => createPictureTemplate(picture)).join('')}
                      </div>`);
  }

  return '';
}

function createDestinationTemplate (currentDestination) {
  const { description , pictures } = currentDestination;

  if (description || pictures.length > 0) {
    return (
      `  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                    ${createPhotoContainerTemplate(pictures)}
                  </section>`
    );
  }


  return '';
}

function createOpenedButtonTemplate (point) {
  const { id } = point;

  if (id) {
    return (
      `   <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`
    );
  }

  return '';
}


function createPointEditViewTemplate (point, offers, selectedOffers, currentDestination, destinations) {
  const { id, type, dateFrom, dateTo, basePrice } = point;
  const { name } = currentDestination;

  const fromDate = formatDate(dateFrom, 'fullDate');
  const toDate = formatDate(dateTo, 'fullDate');

  const isEdit = !id ? 'Cancel' : 'Delete';

  return `
  <li class="trip-events__item"><form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${POINTS_TYPES.map((t) => createTypeListTemplate(t, type, id)).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${id}">
                     ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
                    <datalist id="destination-list-${id}">
                      ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${fromDate}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${id}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${toDate}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">${isEdit}</button>
                  ${createOpenedButtonTemplate(point)}
                </header>
                <section class="event__details">
                  ${createOfferListTemplate(offers, selectedOffers)}
                   ${createDestinationTemplate(currentDestination)}
                </section>
              </form>
              </li>
         `;
}

export default class PointEditView extends AbstractView {
  #point = null;
  #offers = null;
  #selectedOffers = null;
  #destinations = null;
  #currentDestination = null;

  #rollupButtonClick = null;
  #handleFormSubmit = null;

  #rollupBtn = null;

  #deleteButtonClick = null;

  constructor({point, offers, selectedOffers , destinations, onCloseClick, onFormSubmit, onDeleteClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#selectedOffers = selectedOffers;
    this.#destinations = destinations;

    this.#currentDestination = destinations.find(
      (dest) => dest.id === point.destination
    ) || { name: '', description: '', pictures: [] };

    this.#rollupButtonClick = onCloseClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#deleteButtonClick = onDeleteClick;

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#buttonDeleteClick);

    this.#rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (this.#rollupBtn) {
      this.#rollupBtn.addEventListener('click', this.#buttonRollupClick);
    }

  }

  get template() {
    return createPointEditViewTemplate(this.#point, this.#offers, this.#selectedOffers, this.#currentDestination, this.#destinations);
  }

  #buttonRollupClick = (evt) => {
    evt.preventDefault();
    this.#rollupButtonClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };

  #buttonDeleteClick = (evt) => {
    evt.preventDefault();
    this.#deleteButtonClick();
  };


}
