import {render} from '../render.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointsListView from '../view/points-list-view.js';
import PointEditView from '../view/point-edit-view.js';


export default class TripPresenter {
  pointsListView = new PointsListView();
  sortView = new SortView();

  constructor({tripEventsContainer}) {
    this.mainContainer = tripEventsContainer;
  }

  init() {
    render(this.sortView, this.mainContainer);
    render(this.pointsListView, this.mainContainer);
    render (new PointEditView(), this.pointsListView.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointsListView.getElement());
    }

  }
}

