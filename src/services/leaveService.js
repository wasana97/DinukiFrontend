// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class LeavesService {
  api: ApiServiceInterface;

  endpoint: string = "/leaves";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  addLeave(payload: Object) {
    return this.api.post(this.endpoint, payload);
  }

  getLeaves(filters: Object) {
    return this.api.get(this.endpoint, filters);
  }

  deleteLeave(leaveId: string) {
    return this.api.delete(`${this.endpoint}/${leaveId}`);
  }

  paySalary(payload: Object) {
    return this.api.post(`/salary`, payload);
  }
}
