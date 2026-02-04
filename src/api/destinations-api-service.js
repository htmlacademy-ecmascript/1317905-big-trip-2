import ApiService from '../framework/api-service.js';
import {ApiRoute} from '../const.js';


export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({url: ApiRoute.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

}
