import AbstractView from '../framework/view/abstract-view.js';

function createErrorLoadingMessageTemplate() {
  return (
    ' <p class="trip-events__msg">Failed to load latest route information</p>'
  );
}

export default class LoadingErrorView extends AbstractView {
  get template() {
    return createErrorLoadingMessageTemplate();
  }
}
