import {render} from './framework/render.js';
import FiltersView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/points-model.js';
import {generateFilter} from './mock/filter.js';


const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = tripInfoContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');


const pointsModel = new PointModel();
const tripPresenter = new TripPresenter({tripEventsContainer, pointsModel, tripInfoContainer});

const filters = generateFilter(pointsModel.points);

render(new FiltersView({filters}), filtersContainer);


tripPresenter.init();
