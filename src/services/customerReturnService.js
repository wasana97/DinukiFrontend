// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class CustomerReturnService {
  api: ApiServiceInterface;

  endpoint: string = "/customerReturn";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  addCustomerReturn(payload: Object) {
    return this.api.post(this.endpoint, payload);
  }

  getNewCustomerReturnId() {
    return this.api.get(`${this.endpoint}/newCustomerReturnId`);
  }

  getAllCustomerReturns(filters: Object) {
    return this.api.get(this.endpoint, filters);
  }

  deleteCustomerReturn(returnId: string) {
    return this.api.delete(`${this.endpoint}/${returnId}`);
  }

  updateCustomerReturn(payload: Object) {
    return this.api.put(this.endpoint, payload);
  }

  getCustomerReturn(returnId: string) {
    return this.api.get(`${this.endpoint}/${returnId}`);
  }
}
