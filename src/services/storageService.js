// @flow
import type { ApiServiceInterface } from "shared/services/ApiServiceInterface";

export class StorageService {
  api: ApiServiceInterface;

  constructor(apiService: ApiServiceInterface) {
    this.api = apiService;
  }

  saveItem(key, value) {
    return localStorage.setItem(key, value);
  }
  getItem(key) {
    return localStorage.getItem(key);
  }
  deleteItem(key) {
    return localStorage.removeItem(key);
  }
  saveItems(items) {
    return localStorage.multiSet(items);
  }
  getItems(keys) {
    return localStorage.multiGet(keys);
  }
}
