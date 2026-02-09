import { render, replace, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;

  #tripInfoComponent = null;

  constructor({ tripInfoContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#checkAndRender();
  }

  #handleModelEvent = () => {
    this.#checkAndRender();
  };

  #checkAndRender() {

    const allPoints = this.#pointsModel.points || [];
    const destinations = this.#pointsModel.destinations || [];
    const sortedPoints = [...allPoints].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    if (allPoints.length === 0) {
      if (this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const newComponent = new TripInfoView({
      points: sortedPoints,
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
