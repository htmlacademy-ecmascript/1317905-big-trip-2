import { mockTravelPoints } from '../mock/points.js';
import { mockTravelOffers } from '../mock/offers.js';
import { mockTravelDestinations } from '../mock/destinations.js';


export default class PointModel {
  #points = mockTravelPoints;
  #offers = mockTravelOffers;
  #destinations = mockTravelDestinations;

  get points() {
    return this.#points;
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


}
