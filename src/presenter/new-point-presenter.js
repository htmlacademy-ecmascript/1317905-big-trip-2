import {remove, render, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {EMPTY_POINT, UserAction, UpdateType} from '../const.js';


export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #allDestinations = null;
  #offers = null;

  #pointEditComponent = null;

  constructor({pointListContainer, allDestinations, offers, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#allDestinations = allDestinations;
    this.#offers = offers;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      point: EMPTY_POINT,
      allOffers: this.#offers,
      destinations: this.#allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCloseClick: this.#handleDeleteClick
    });
    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    const newPoint = { ...point };
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      newPoint
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
