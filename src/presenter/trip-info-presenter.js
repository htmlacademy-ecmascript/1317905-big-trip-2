import { render, replace, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { UpdateType } from '../const.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;

  #tripInfoComponent = null;
  #isModelReady = false;

  constructor({ tripInfoContainer, pointsModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#checkAndRender();
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.#isModelReady = true;
    }
    if (this.#isModelReady) {
      this.#checkAndRender();
    }
  };

  #checkAndRender() {
    const points = this.#pointsModel.points || [];
    const destinations = this.#pointsModel.destinations || [];

    if (points.length === 0) {
      if (this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const newComponent = new TripInfoView({
      points,
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
