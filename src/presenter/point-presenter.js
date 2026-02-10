import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { Mode, UserAction, UpdateType } from '../const.js';

export default class PointPresenter {
  #pointListContainer = null;
  #point = null;
  #pointsModel = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;
  #escListenerAdded = false;

  constructor({ pointListContainer, pointsModel, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#pointsModel.getSelectedOffers(point.type, point.offers),
      destinations: this.#pointsModel.destinations,
      onEditClick: this.#openFormClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      allOffers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      onCloseClick: this.#closeFormClick,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#deleteButtonClick
    });

    if (prevPointComponent === null && prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
      this.#removeEscListener();
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    this.#removeEscListener();
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
    this.#pointComponent = null;
    this.#pointEditComponent = null;
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    if (!this.#pointEditComponent || !this.#pointEditComponent.element) {
      return;
    }
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (!this.#pointEditComponent || !this.#pointEditComponent.element) {
      return;
    }
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (!this.#pointEditComponent || !this.#pointEditComponent.element) {
      return;
    }

    const resetFormState = () => {
      if (
        !this.#pointEditComponent ||
      !this.#pointEditComponent.element ||
      !document.body.contains(this.#pointEditComponent.element)
      ) {
        return;
      }

      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent?.shake?.();
      return;
    }


    if (this.#pointEditComponent.element) {
      this.#pointEditComponent.shake(resetFormState);
    }
  }


  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);

    if (!this.#escListenerAdded) {
      document.addEventListener('keydown', this.#escKeyDownHandler);
      this.#escListenerAdded = true;
    }

    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#removeEscListener();
    this.#mode = Mode.DEFAULT;
  }

  #removeEscListener() {
    if (this.#escListenerAdded) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#escListenerAdded = false;
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      if (!evt.defaultPrevented) {
        evt.preventDefault();
        this.#pointEditComponent.reset(this.#point);
        this.#replaceFormToPoint();
      }
    }
  };

  #openFormClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      updatedPoint
    );
  };

  #closeFormClick = () => {
    this.#replaceFormToPoint();
  };

  #deleteButtonClick = () => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#point
    );
  };
}
