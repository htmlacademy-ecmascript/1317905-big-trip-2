import { render, replace} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointsListView from '../view/points-list-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class TripPresenter {
  #pointsModel = null;
  #mainContainer = null;

  #tripPoints = [];
  #allDestinations = [];

  #pointsListView = new PointsListView();
  #sortView = new SortView();

  constructor({ tripEventsContainer, pointsModel }) {
    this.#mainContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#allDestinations = [...this.#pointsModel.destinations];

    this.#renderApp();

  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointView = new PointView({
      point,
      offers: this.#pointsModel.getSelectedOffers(point.type, point.offers),
      destinations: this.#allDestinations,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditView = new PointEditView({
      point,
      offers: this.#pointsModel.getOffersByType(point.type),
      selectedOffers: point.offers,
      destinations: this.#allDestinations,
      onCloseClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditView, pointView);
    }

    function replaceFormToPoint() {
      replace(pointView, pointEditView);
    }

    render(pointView, this.#pointsListView.element);
  }

  #renderApp() {
    render(this.#sortView, this.#mainContainer);
    render(this.#pointsListView, this.#mainContainer);

    for (let i = 0; i < this.#tripPoints.length; i++) {

      this.#renderPoint(this.#tripPoints[i]);

    }

  }
}
