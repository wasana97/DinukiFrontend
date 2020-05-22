// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class EmployeeService {
  api: ApiServiceInterface;

  endpoint: string = "/employees";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  getNewEmployeeCode() {
    return this.api.get(`${this.endpoint}/newEmployeeId`);
  }

  addEmployee(payload: Object) {
    return this.api.post(this.endpoint, payload);
  }

  updateEmployee(payload: Object) {
    return this.api.put(this.endpoint, payload);
  }

  getEmployees(filters: Object) {
    return this.api.get(this.endpoint, filters);
  }

  getEmployee(EmployeeId: string) {
    return this.api.get(`${this.endpoint}/${EmployeeId}`);
  }

  deleteEmployee(employeeId) {
    return this.api.delete(`${this.endpoint}/${employeeId}`);
  }
}
