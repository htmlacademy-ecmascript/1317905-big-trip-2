import ApiService from '../framework/api-service.js';
import {Method, ApiRoute} from '../const.js';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: ApiRoute.POINTS})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${ApiRoute.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: ApiRoute.POINTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${ApiRoute.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'is_favorite': point.isFavorite,
    };


    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;


    return adaptedPoint;
  }
}
