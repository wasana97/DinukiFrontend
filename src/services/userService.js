// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class UserService {
  api: ApiServiceInterface;

  endpoint: string = "/auth";

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  getAllUsers() {
    return this.api.get(`${this.endpoint}/profile/all`);
  }

  updateUser(payload: Object) {
    return this.api.put(`${this.endpoint}/profile`, payload);
  }

  getUser(userId: strig) {
    return this.api.get(`${this.endpoint}/profile/user/${userId}`);
  }

  deleteUser(userId: strig) {
    return this.api.delete(`${this.endpoint}/profile/${userId}`);
  }
}
