import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatDate } from '../utils/point.js';
import { POINTS_TYPES } from '../const.js';

import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';


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

function createOfferListTemplate(offers, checkedOffers) {
  if (offers.length > 0) {
    return ` <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                     ${offers.map((offer) => createOfferTemplate(offer, checkedOffers)).join('')}
                    </div>
                  </section>`;
  }
  return '';
}

function createPictureTemplate(picture) {
  const { src, description } = picture;
  return ` <img class="event__photo" src="${src}" alt="${description}"> `;
}

function createPhotoContainerTemplate(pictures) {
  if (pictures.length > 0) {
    return (`<div class="event__photos-container">
                      <div class="event__photos-tape">
                       ${pictures.map((picture) => createPictureTemplate(picture)).join('')}
                      </div>
                    </div>`);
  }
  return '';
}

function createDestinationTemplate(currentDestination) {
  const { description, pictures } = currentDestination;

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

function createOpenedButtonTemplate(point) {
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

function createPointEditViewTemplate(state, offers, selectedOffers, currentDestination, destinations) {
  const { type, basePrice, dateFrom, dateTo, id } = state;


  const startDate = formatDate(dateFrom, 'fullDate');
  const endDate = formatDate(dateTo, 'fullDate');

  const typesList = POINTS_TYPES.map((pointType) => createTypeListTemplate(pointType, type, id)).join('');
  const destinationsList = destinations.map((dest) => `<option value="${he.encode(dest.name)}"></option>`).join('');
  const offersList = createOfferListTemplate(offers, selectedOffers);
  const destinationTemplate = createDestinationTemplate(currentDestination);
  const rollupButton = createOpenedButtonTemplate(state);

  const isEdit = state.id ? 'Delete' : 'Cancel';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
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
                ${typesList}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type[0].toUpperCase() + type.slice(1)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${destinationsList}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endDate}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
          </div>

        <button class="event__save-btn btn btn--blue" type="submit"
  ${state.isDisabled || state.isSaving ? 'disabled' : ''}>
  ${state.isSaving ? 'Saving...' : 'Save'}
</button>

<button class="event__reset-btn" type="reset"
  ${state.isDisabled || state.isDeleting ? 'disabled' : ''}>
  ${state.isDeleting ? 'Deleting...' : isEdit}
</button>
          ${rollupButton}
        </header>
        <section class="event__details">
          ${offersList}
          ${destinationTemplate}
        </section>
      </form>
    </li>`;
}

export default class PointEditView extends AbstractStatefulView {
  #allOffers = null;
  #destinations = null;

  #rollupButtonClick = null;
  #handleFormSubmit = null;
  #deleteButtonClick = null;

  #rollupBtn = null;
  #startPicker = null;
  #endPicker = null;

  constructor({point, allOffers, destinations, onCloseClick, onFormSubmit, onDeleteClick}) {
    super();
    this.#allOffers = allOffers;
    this.#destinations = destinations;

    this.#rollupButtonClick = onCloseClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#deleteButtonClick = onDeleteClick;

    this._setState(PointEditView.parsePointToState(point));
    this._restoreHandlers();
  }

  get template() {
    const offersForType = this.#allOffers.find(
      (group) => group.type === this._state.type
    )?.offers || [];
    const currentDestination = this.#destinations.find((dest) => dest.id === this._state.destination) || {
      name: '',
      description: '',
      pictures: []
    };
    return createPointEditViewTemplate(this._state, offersForType, this._state.offers, currentDestination, this.#destinations);
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')?.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')?.addEventListener('click', this.#buttonDeleteClick);
    this.element.querySelector('.event__type-group')?.addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--destination')?.addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--destination')?.addEventListener('blur', this.#destinationInputBlurHandler);
    this.element.querySelector('.event__input--price')?.addEventListener('change', this.#priceChangeHandler);

    this.#rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (this.#rollupBtn) {
      this.#rollupBtn.addEventListener('click', this.#buttonRollupClick);
    }

    this.#setDatepickers();
  }

  #buttonRollupClick = (evt) => {
    evt.preventDefault();
    this.#rollupButtonClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #buttonDeleteClick = (evt) => {
    evt.preventDefault();
    this.#deleteButtonClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    this.updateElement({
      type: newType,
      offers: []
    });
  };

  #destinationInputHandler = (evt) => {
    const selectedName = evt.target.value.trim();
    const selectedDest = this.#destinations.find((dest) => dest.name === selectedName);

    if (selectedDest) {
      this.updateElement({
        destination: selectedDest.id
      });
    }
  };

  #destinationInputBlurHandler = (evt) => {
    const currentDest = this.#destinations.find((dest) => dest.id === this._state.destination);
    evt.target.value = currentDest ? currentDest.name : '';
  };

  #offerChangeHandler = (evt) => {
    const checkbox = evt.target;

    if (!checkbox.matches('.event__offer-checkbox')) {
      return;
    }
    const offerId = checkbox.name.replace('event-offer-', '');
    let newOffers = [...this._state.offers];

    if (checkbox.checked) {
      if (!newOffers.includes(offerId)) {
        newOffers.push(offerId);
      }
    } else {
      newOffers = newOffers.filter((id) => id !== offerId);
    }

    this.updateElement({
      offers: newOffers
    });
  };

  removeElement() {
    if (this.#startPicker) {
      this.#startPicker.destroy();
      this.#startPicker = null;
    }
    if (this.#endPicker) {
      this.#endPicker.destroy();
      this.#endPicker = null;
    }
    super.removeElement();
  }


  #startDateChangeHandler = (selectedDates, dateStr, instance) => {
    const startDate = selectedDates[0];

    if (startDate) {
      this._setState({
        dateFrom: startDate,
      });

      instance.element.value = instance.formatDate(startDate, 'd/m/y H:i');
      if (this.#endPicker) {
        this.#endPicker.set('minDate', startDate);
        const currentEnd = this._state.dateTo ? new Date(this._state.dateTo) : null;
        if (currentEnd && currentEnd < startDate) {
          this.#endPicker.setDate(startDate, true);
          this._setState({ dateTo: startDate });
        }
      }
    }
  };


  #endDateChangeHandler = (selectedDates, dateStr, instance) => {
    const endDate = selectedDates[0];

    if (endDate) {
      this._setState({
        dateTo: endDate,
      });
      instance.element.value = instance.formatDate(endDate, 'd/m/y H:i');
    }
  };


  #setDatepickers() {
    const startInput = this.element.querySelector(`#event-start-time-${this._state.id}`);
    const endInput = this.element.querySelector(`#event-end-time-${this._state.id}`);

    if (!startInput || !endInput) {
      return;
    }

    const fpFormat = 'd/m/y H:i';

    this.#startPicker = flatpickr(startInput, {
      enableTime: true,
      'time_24hr': true,
      dateFormat: fpFormat,
      defaultDate: this._state.dateFrom ? new Date(this._state.dateFrom) : null,
      onChange: this.#startDateChangeHandler,
    });

    this.#endPicker = flatpickr(endInput, {
      enableTime: true,
      'time_24hr': true,
      dateFormat: fpFormat,
      defaultDate: this._state.dateTo ? new Date(this._state.dateTo) : null,
      minDate: this._state.dateFrom ? new Date(this._state.dateFrom) : null,
      onChange: this.#endDateChangeHandler,
    });
  }

  #priceChangeHandler = (evt) => {
    evt.target.value = evt.target.value.replace(/[^0-9]/g, '');
    const newPrice = parseInt(evt.target.value, 10) || 0;
    this._setState({ basePrice: newPrice });
  };

  static parsePointToState(point) {
    return { ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;

  }
}
