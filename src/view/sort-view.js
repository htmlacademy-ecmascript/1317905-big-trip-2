import AbstractView from '../framework/view/abstract-view.js';
import {SORT_ITEMS, SortType} from '../const.js';

function createSortTemplate(currentSortType) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SORT_ITEMS.map(({ type, disabled = false }) => `
        <div class="trip-sort__item  trip-sort__item--${type}">
          <input
            id="sort-${type}"
            class="trip-sort__input  visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-${type}"
            data-sort-type="${type}"
            ${currentSortType === type ? 'checked' : ''}
            ${disabled ? 'disabled' : ''}>
          <label class="trip-sort__btn" for="sort-${type}">
            ${type[0].toUpperCase() + type.slice(1)}
          </label>
        </div>
      `).join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #currentSortType = SortType.DEFAULT;
  #handleSortTypeChange = null;

  constructor({ currentSortType = SortType.DAY, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
