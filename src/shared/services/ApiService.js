// @flow
import { serialize } from "../helpers/url";
import type { ApiServiceInterface } from "./ApiServiceInterface";

export class ApiService implements ApiServiceInterface {
  static METHOD_GET = "GET";
  static METHOD_PUT = "PUT";
  static METHOD_POST = "POST";
  static METHOD_DELETE = "DELETE";

  defaultOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  _baseUrl: string;
  _authToken: string;

  constructor(baseUrl: string) {
    this._baseUrl = this._formatApiEndpoint(baseUrl);
  }

  get baseUrl() {
    return this._baseUrl;
  }

  /**
   * @return {string}
   */
  get authToken() {
    return this._authToken;
  }

  /**
   * @param {string} value
   */
  set authToken(value: string) {
    this._authToken = value;
  }

  _getAuthorizationHeaderContent() {
    return this._authToken;
  }

  _formatApiEndpoint(baseUrl: string): string {
    return baseUrl.replace(/\/$/, "");
  }

  get(
    endpoint: string,
    query: Object = {},
    options: Object = {}
  ): Promise<Response & any> {
    return this._fetch(
      this.constructor.METHOD_GET,
      endpoint,
      {},
      query,
      options
    );
  }

  post(
    endpoint: string,
    body: Object = {},
    query: Object = {},
    options: Object = {},
    removeContentType: Boolean = false
  ): Promise<Response & any> {
    return this._fetch(
      this.constructor.METHOD_POST,
      endpoint,
      body,
      query,
      options,
      removeContentType
    );
  }

  put(
    endpoint: string,
    body: Object = {},
    query: Object = {},
    options: Object = {}
  ): Promise<Response & any> {
    return this._fetch(
      this.constructor.METHOD_PUT,
      endpoint,
      body,
      query,
      options
    );
  }

  delete(
    endpoint: string,
    query: Object = {},
    body: Object = {},
    options: Object = {}
  ): Promise<Response & any> {
    return this._fetch(
      this.constructor.METHOD_DELETE,
      endpoint,
      body,
      query,
      options
    );
  }

  buildUrl(endpoint: string, query: Object = {}): string {
    if (Object.keys(query).length > 0) {
      endpoint = `${endpoint}?${serialize(query)}`;
    }

    return `${this._baseUrl}${endpoint}`;
  }

  _fetch(
    method: string,
    endpoint: string,
    body: Object = {},
    query: Object = {},
    options: Object = {},
    removeContentType = false
  ): Promise<Response & any> {
    if (removeContentType) {
      delete this.defaultOptions.headers["Content-Type"];
      delete this.defaultOptions.headers["Accept"];
    } else {
      this.defaultOptions.headers.Accept = "application/json";
      this.defaultOptions.headers["Content-Type"] = "application/json";
    }

    const url = this.buildUrl(endpoint, query);

    options = { ...this.defaultOptions, ...options, method };

    if (Object.keys(body).length > 0) {
      options.body = typeof body === "object" ? JSON.stringify(body) : body;
    }

    if (this._authToken) {
      options.headers.Authorization = this._getAuthorizationHeaderContent();
    }

    if (body instanceof FormData) {
      options.body = body;
    }

    return fetch(url, options).then(response => response.json());
  }
}
