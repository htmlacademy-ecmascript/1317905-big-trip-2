import { render, RenderPosition} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import TripInfoView from '../view/trip-info-view.js';
import NoPointsView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/point.js';
import {sortByPrice, sortByTime} from '../utils/sort.js';
import {SortType} from '../const.js';

export default class TripPresenter {
  #pointsModel = null;
  #mainContainer = null;
  #tripMainElement = null;

  #tripPoints = [];
  #allDestinations = [];

  #pointPresenters = new Map();

  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

  #pointsListView = new PointsListView();
  #sortView = null;
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

    this.#sourcedPoints = [...this.#pointsModel.points];

    this.#renderApp();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #handleDataChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);

    if (this.#currentSortType === SortType.TIME || this.#currentSortType === SortType.PRICE) {
      this.#sortTasks(this.#currentSortType);
      this.#clearPointsList();
      this.#renderPointsList();
      this.#renderPoints();
    } else {

      this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
    }
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

  #sortTasks(sortType) {
    switch (sortType) {
      case SortType.DEFAULT:
        this.#tripPoints = [...this.#sourcedPoints];
        break;
      case SortType.TIME:
        this.#tripPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #renderInfo() {
    render(this.#tripInfoView, this.#tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);

    this.#clearPointsList();
    this.#renderPointsList();
    this.#renderPoints();
  };

  #renderSort() {
    this.#sortView = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
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

  #renderPoints() {
    this.#tripPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderApp() {

    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderInfo();
    this.#renderSort();
    this.#renderPointsList();

    this.#renderPoints();

  }
}
