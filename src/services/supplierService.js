// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class SupplierService {
  api: ApiServiceInterface;

  endpoint: string = "/suppliers";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  getNewSupplierCode() {
    return this.api.get(`${this.endpoint}/newSupplierCode`);
  }

  addSupplier(payload: Object) {
    return this.api.post(this.endpoint, payload);
  }

  updateSupplier(payload: Object) {
    return this.api.put(this.endpoint, payload);
  }

  getSupplier(supplierCode: string) {
    return this.api.get(`${this.endpoint}/${supplierCode}`);
  }

  getSuppliers(filters: Object) {
    return this.api.get(this.endpoint, filters);
  }

  deleteSupplier(supplierCode: strig) {
    return this.api.delete(`${this.endpoint}/${supplierCode}`);
  }
}
