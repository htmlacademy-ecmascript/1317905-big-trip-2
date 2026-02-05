import { render, replace, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { filter } from '../utils/filter.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #tripInfoComponent = null;

  constructor({ tripInfoContainer, pointsModel, filterModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#checkAndRender();
  }

  #handleModelEvent = () => {
    this.#checkAndRender();
  };

  #checkAndRender() {

    const filterType = this.#filterModel.filter;
    const allPoints = this.#pointsModel.points || [];
    const visiblePoints = filter[filterType](allPoints);

    visiblePoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    const destinations = this.#pointsModel.destinations || [];

    if (visiblePoints.length === 0) {
      if (this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const newComponent = new TripInfoView({
      points: visiblePoints,
      destinations,
      getSelectedOffers: this.#pointsModel.getSelectedOffers.bind(this.#pointsModel)
    });

    if (this.#tripInfoComponent) {
      replace(newComponent, this.#tripInfoComponent);
    } else {
      render(newComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    }

    this.#tripInfoComponent = newComponent;
  }

  update() {
    this.#checkAndRender();
  }
}
