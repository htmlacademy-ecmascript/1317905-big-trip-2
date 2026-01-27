import Observable from '../framework/observable.js';
import { mockTravelPoints } from '../mock/points.js';
import { mockTravelOffers } from '../mock/offers.js';
import { mockTravelDestinations } from '../mock/destinations.js';


export default class PointModel extends Observable{
  #points = mockTravelPoints;
  #offers = mockTravelOffers;
  #destinations = mockTravelDestinations;

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

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }


}
