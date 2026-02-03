import ApiService from '../framework/api-service.js';
import {ApiRoute} from '../const.js';


export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({url: ApiRoute.OFFERS})
      .then(ApiService.parseResponse);
  }


}
