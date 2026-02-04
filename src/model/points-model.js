import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointModel extends Observable{
  #pointsApiService = null;
  #destinationsApiService = null;
  #offersApiService = null;

  #points = [];
  #offers = [];
  #destinations = [];

  constructor({pointsApiService, destinationsApiService, offersApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#destinationsApiService = destinationsApiService;
    this.#offersApiService = offersApiService;

  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const offerGroup = this.#offers.find((item) => item.type === type);
    return offerGroup ? offerGroup.offers : [];
  }

  getSelectedOffers(type, selectedOfferIds) {
    const allOffersForType = this.getOffersByType(type);
    return allOffersForType.filter((offer) =>
      selectedOfferIds.includes(offer.id)
    );
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      const destinations = await this.#destinationsApiService.destinations;
      const offers = await this.#offersApiService.offers;

      this.#destinations = destinations;
      this.#offers = offers;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this._notify(UpdateType.ERROR);
      return;
    }

    this._notify(UpdateType.INIT);
  }


  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice:point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo:point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };


    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }


}
