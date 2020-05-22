// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class OrdersService {
  api: ApiServiceInterface;

  endpoint: string = "/orders";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  addOrders(payload: Object) {
    return this.api.post(this.endpoint, payload);
  }

  getNewOrderId() {
    return this.api.get(`${this.endpoint}/newOrderId`);
  }

  deleteOrders(orderId: string) {
    return this.api.delete(`${this.endpoint}/${orderId}`);
  }

  getOrders(filters: Object = {}) {
    return this.api.get(this.endpoint, filters);
  }

  getOrder(orderId: string) {
    return this.api.get(`${this.endpoint}/${orderId}`);
  }

  updateOrders(payload: Object) {
    return this.api.put(this.endpoint, payload);
  }
}
