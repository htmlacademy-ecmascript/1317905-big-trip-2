import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate (filter, currentFilterType) {
  const {type, count} = filter;

  const labelText = type.charAt(0).toUpperCase() + type.slice(1);

  const isChecked = type === currentFilterType ? 'checked' : '';
  const isDisabled = count === 0 ? 'disabled' : '';
  return `
      <div class="trip-filters__filter">
            <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked} ${isDisabled}>
          <label class="trip-filters__filter-label" for="filter-${type}">${labelText}</label>
        </div>
              `;
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');
  return (
    `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
            </div><button class="visually-hidden" type="submit">Accept filter</button>
              </form>`
  );
}


export default class FiltersView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

}
