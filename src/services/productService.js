// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class ProductService {
  api: ApiServiceInterface;

  endpoint: string = "/products";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  addProduct(payload: Object) {
    return this.api.post(this.endpoint, payload);
  }

  getNewProductCode() {
    return this.api.get(`${this.endpoint}/newProductCode`);
  }

  deleteProduct(productCode: string) {
    return this.api.delete(`${this.endpoint}/${productCode}`);
  }

  getProducts(filters: Object = {}) {
    return this.api.get(this.endpoint, filters);
  }

  getProduct(productCode: string) {
    return this.api.get(`${this.endpoint}/${productCode}`);
  }

  updateProduct(payload: Object) {
    return this.api.put(this.endpoint, payload);
  }
}
