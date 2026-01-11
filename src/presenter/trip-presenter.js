import { render, RenderPosition} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import TripInfoView from '../view/trip-info-view.js';
import NoPointsView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/point.js';

export default class TripPresenter {
  #pointsModel = null;
  #mainContainer = null;
  #tripMainElement = null;

  #tripPoints = [];
  #allDestinations = [];

  #pointPresenters = new Map();

  #pointsListView = new PointsListView();
  #sortView = new SortView();
  #tripInfoView = new TripInfoView();
  #noPointsView = new NoPointsView();

  constructor({ tripEventsContainer, pointsModel, tripInfoContainer }) {
    this.#mainContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#tripMainElement = tripInfoContainer;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#allDestinations = [...this.#pointsModel.destinations];

    this.#renderApp();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #handleDataChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListView.element,
      pointsModel: this.#pointsModel,
      allDestinations: this.#allDestinations,
      onDataChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }


  #renderInfo() {
    render(this.#tripInfoView, this.#tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    render(this.#sortView, this.#mainContainer);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointsList() {
    render(this.#pointsListView, this.#mainContainer);
  }

  #renderNoPoints() {
    render(this.#noPointsView, this.#mainContainer);
  }


  #renderApp() {

    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderInfo();
    this.#renderSort();
    this.#renderPointsList();

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }

  }
}
