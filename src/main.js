import {render, RenderPosition} from './render.js';
import FiltersView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';


import TripInfoView from './view/trip-info-view.js';


const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = tripInfoContainer.querySelector('.trip-controls__filters');

const tripEventsContainer = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({tripEventsContainer});

render(new TripInfoView(), tripInfoContainer, RenderPosition.AFTERBEGIN);
render(new FiltersView(), filtersContainer);


tripPresenter.init();
