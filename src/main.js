import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './api/points-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';
import OffersApiService from './api/offers-api-service.js';
import {END_POINT, AUTHORIZATION} from './const.js';


const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = tripInfoContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationsApiService = new DestinationsApiService(END_POINT, AUTHORIZATION);
const offersApiService = new OffersApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointModel({
  pointsApiService,
  destinationsApiService,
  offersApiService,
});


const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer,
  pointsModel,
});

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointsModel
});
const tripPresenter = new TripPresenter({
  tripEventsContainer,
  pointsModel,
  filterModel,
  tripInfoContainer
});

newEventButton.disabled = true;


filterPresenter.init();
tripPresenter.init();
tripInfoPresenter.init();
pointsModel.init()
  .finally(() => {
    newEventButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      tripPresenter.createPoint();
    });

  });
