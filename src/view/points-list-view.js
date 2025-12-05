import {createElement} from '../render.js';

function createPointsListViewTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class PointsListView {
  getTemplate() {
    return createPointsListViewTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
