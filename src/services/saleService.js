// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class SaleService {
  api: ApiServiceInterface;

  endpoint: string = "/sales";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  addSaleOrder(payload: Object) {
    return this.api.post(this.endpoint, payload);
  }

  getNewSaleId() {
    return this.api.get(`${this.endpoint}/newSalesId`);
  }

  getAllSales(filters: Object) {
    return this.api.get(this.endpoint, filters);
  }

  deleteSaleOrder(saleId: string) {
    return this.api.delete(`${this.endpoint}/${saleId}`);
  }
}
