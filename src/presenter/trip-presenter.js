import { render, remove, replace } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import LoadingView from '../view/loading-view.js';
import LoadingErrorView from '../view/loading-error-view.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortByPrice, sortByTime } from '../utils/sort.js';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit } from '../const.js';
import { filter } from '../utils/filter.js';

export default class TripPresenter {
  #pointsModel = null;
  #filterModel = null;
  #mainContainer = null;
  #newEventButton = null;

  #tripPoints = [];
  #allDestinations = [];
  #allOffers = [];

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DEFAULT;

  #pointsListView = new PointsListView();
  #sortView = null;
  #loadingComponent = new LoadingView();
  #errorLoadingComponent = new LoadingErrorView();
  #noPointsView = null;

  #isCreating = false;
  #isLoading = true;
  #isError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ tripEventsContainer, pointsModel, filterModel }) {
    this.#mainContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newEventButton = document.querySelector('.trip-main__event-add-btn');

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const allPoints = this.#pointsModel.points;
    const filteredPoints = filter[filterType](allPoints);

    const sortedPoints = [...filteredPoints];

    switch (this.#currentSortType) {
      case SortType.TIME:
        sortedPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        sortedPoints.sort(sortByPrice);
        break;
      default:
        sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }

    return sortedPoints;
  }

  init() {
    this.#handleModelEvent();
  }

  createPoint() {
    if (this.#isError) {
      return;
    }
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#handleModeChange();
    if (this.#tripPoints.length === 0) {
      remove(this.#noPointsView);
      this.#noPointsView = null;
      render(this.#pointsListView, this.#mainContainer);
    }
    this.#isCreating = true;
    if (this.#newEventButton) {
      this.#newEventButton.disabled = true;
    }
    this.#newPointPresenter.init();
  }

  #handleNewPointDestroy = () => {
    if (this.#newEventButton) {
      this.#newEventButton.disabled = this.#isError;
    }
    if (this.#isCreating && this.points.length === 0) {
      remove(this.#pointsListView);
      this.#renderNoPoints();
    }
    this.#isCreating = false;
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
          this.#isCreating = false;
          if (this.#newEventButton) {
            this.#newEventButton.disabled = false;
          }
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();

  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MAJOR:
        this.#currentSortType = SortType.DEFAULT;
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isError = false;

        this.#allDestinations = [...this.#pointsModel.destinations];
        this.#allOffers = this.#pointsModel.offers;

        this.#newPointPresenter = new NewPointPresenter({
          pointListContainer: this.#pointsListView.element,
          allDestinations: this.#allDestinations,
          offers: this.#allOffers,
          onDataChange: this.#handleViewAction,
          onDestroy: this.#handleNewPointDestroy
        });
        remove(this.#loadingComponent);
        if (this.#newEventButton) {
          this.#newEventButton.disabled = false;
        }
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#isError = true;
        remove(this.#loadingComponent);
        if (this.#newEventButton) {
          this.#newEventButton.disabled = true;
        }
        break;
    }

    this.#tripPoints = this.points;
    this.#clearPointsList();
    this.#renderApp();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#tripPoints = this.points;
    this.#clearPointsList();
    this.#renderApp();
  };

  #renderApp() {
    this.#tripPoints = this.points;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isError) {
      this.#renderError();
      return;
    }


    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints();
  }


  #renderSort() {
    const newSortView = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if (this.#sortView === null) {
      render(newSortView, this.#mainContainer);
    } else {
      replace(newSortView, this.#sortView);
    }

    this.#sortView = newSortView;
  }

  #renderPointsList() {
    render(this.#pointsListView, this.#mainContainer);
  }

  #renderPoints() {
    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListView.element,
      pointsModel: this.#pointsModel,
      allDestinations: this.#allDestinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#mainContainer);
  }

  #renderError() {
    render(this.#errorLoadingComponent, this.#mainContainer);
    if (this.#newEventButton) {
      this.#newEventButton.disabled = true;
    }
  }


  #renderNoPoints() {
    remove(this.#noPointsView);
    this.#noPointsView = new NoPointView({ filterType: this.#filterModel.filter });
    render(this.#noPointsView, this.#mainContainer);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#noPointsView);
    remove(this.#sortView);
    remove(this.#loadingComponent);
    remove(this.#errorLoadingComponent);

    this.#noPointsView = null;
    this.#sortView = null;
  }

}
