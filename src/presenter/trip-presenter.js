import { RenderPosition, render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointsListView from '../view/points-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import {EMPTY_POINT} from '../const.js';
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

    render(this.#sortView, this.#mainContainer);
    render(this.#pointsListView, this.#mainContainer);

    render(
      new PointEditView({
        point: EMPTY_POINT,
        offers: this.#pointsModel.getOffersByType(EMPTY_POINT.type),
        selectedOffers: EMPTY_POINT.offers,
        destinations: this.#allDestinations,
      }),
      this.#pointsListView.element,
      RenderPosition.AFTERBEGIN
    );


    render(
      new PointEditView({
        point: this.#tripPoints[0],
        offers: this.#pointsModel.getOffersByType(this.#tripPoints[0].type),
        selectedOffers: this.#tripPoints[0].offers,
        destinations: this.#allDestinations,
      }),
      this.#pointsListView.element

    );

    for (let i = 0; i < this.#tripPoints.length; i++) {
      render(
        new PointView({
          point: this.#tripPoints[i],
          offers: this.#pointsModel.getSelectedOffers(
            this.#tripPoints[i].type,
            this.#tripPoints[i].offers
          ),
          destinations: this.#allDestinations,
        }),
        this.#pointsListView.element
      );
    }
  }
}
