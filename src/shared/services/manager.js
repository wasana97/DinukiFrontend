// @flow
import { ServiceManager } from "../kernel/ServiceManager";
import ConfigService from "./ConfigService";
import { ApiService } from "./ApiService";

export const serviceManager = new ServiceManager();

export const registerGlobalServices = (options: Object) => {
  serviceManager.register("ConfigService", () => {
    return new ConfigService(options);
  });

  serviceManager.register("ApiService", serviceManager => {
    let config = (serviceManager.get("ConfigService"): ConfigService);

    return new ApiService(config.get("api.baseUrl"));
  });
};
