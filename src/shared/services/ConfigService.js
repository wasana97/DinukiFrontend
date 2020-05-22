// @flow
import { entries } from "../kernel/iterators";
import UndefinedArgumentError from "../errors/UndefinedArgumentError";

export default class ConfigService {
  _store: Object = {};

  constructor(initialStore: Object = {}) {
    this._store = initialStore;
  }

  static createWithEnvVars(defaults: Object, envVars: Object): ConfigService {
    if (defaults === undefined) {
      throw new UndefinedArgumentError("defaults");
    }

    if (envVars === undefined) {
      throw new UndefinedArgumentError("envVars");
    }

    let instance = new this(defaults);

    for (let [key, value] of entries(envVars)) {
      instance.set(key, value);
    }

    return instance;
  }

  _recurse(key?: string, value?: any): any {
    if (key === undefined) {
      return this._store;
    }

    let writeMode = value !== undefined;

    let currentLevel = this._store;
    let levels = key.split(".");

    for (let i = 0, l = levels.length; i < l; i++) {
      if (!writeMode && currentLevel[levels[i]] === undefined) {
        return null;
      }

      if (!writeMode) {
        currentLevel = currentLevel[levels[i]];
        continue;
      }

      if (currentLevel[levels[i]] === undefined) {
        currentLevel[levels[i]] = {};
      }

      if (i + 1 === l) {
        currentLevel[levels[i]] = value;
      }

      currentLevel = currentLevel[levels[i]];
    }

    return currentLevel;
  }

  get(key?: string, defaultValue: any = null): any {
    return this._recurse(key) || defaultValue;
  }

  set(key: string, value: any): ConfigService {
    this._recurse(key, value);
    return this;
  }

  reset() {
    this._store = {};
  }

  toJS(): Object {
    return this._store;
  }
}
