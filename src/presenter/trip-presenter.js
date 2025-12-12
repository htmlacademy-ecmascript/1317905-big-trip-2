import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointsListView from '../view/points-list-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class TripPresenter {
  pointsListView = new PointsListView();
  sortView = new SortView();

  constructor({ tripEventsContainer, pointsModel }) {
    this.mainContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];
    this.tripDestinations = [...this.pointsModel.getDestinations()];

    render(this.sortView, this.mainContainer);
    render(this.pointsListView, this.mainContainer);

    render(
      new PointEditView({
        point: this.tripPoints[0],
        offers: this.pointsModel.getOffersByType(this.tripPoints[0].type),
        selectedOffers: this.tripPoints[0].offers,
        destinations: this.tripDestinations,
        destination: this.pointsModel.getDestinationById(this.tripPoints[0].destination),
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
          destination: this.pointsModel.getDestinationById(
            this.tripPoints[i].destination
          ),
        }),
        this.pointsListView.getElement()
      );
    }
  }
}
