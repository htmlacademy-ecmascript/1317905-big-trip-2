import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointsListView from '../view/points-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import {EMPTY_POINT} from '../const.js';
export default class TripPresenter {
  pointsListView = new PointsListView();
  sortView = new SortView();

  constructor({ tripEventsContainer, pointsModel }) {
    this.mainContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];
    this.allDestinations = [...this.pointsModel.getDestinations()];

    render(this.sortView, this.mainContainer);
    render(this.pointsListView, this.mainContainer);

    render(
      new PointEditView({
        point: EMPTY_POINT,
        offers: this.pointsModel.getOffersByType(EMPTY_POINT.type),
        selectedOffers: EMPTY_POINT.offers,
        destinations: this.allDestinations,
      }),
      this.pointsListView.getElement(),
      'afterbegin'
    );


    render(
      new PointEditView({
        point: this.tripPoints[0],
        offers: this.pointsModel.getOffersByType(this.tripPoints[0].type),
        selectedOffers: this.tripPoints[0].offers,
        destinations: this.allDestinations,
      }),
      this.pointsListView.getElement()

    );

    for (let i = 0; i < this.tripPoints.length; i++) {
      render(
        new PointView({
          point: this.tripPoints[i],
          offers: this.pointsModel.getSelectedOffers(
            this.tripPoints[i].type,
            this.tripPoints[i].offers
          ),
          destinations: this.allDestinations,
        }),
        this.pointsListView.getElement()
      );
    }
  }
}
