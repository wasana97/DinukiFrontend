import {
  registerGlobalServices,
  serviceManager,
} from "shared/services/manager";
import { AuthService } from "./authService";
import { StorageService } from "./storageService";
import { ProductService } from "./productService";
import { EmployeeService } from "./employeeService";
import { SupplierService } from "./supplierService";
import { LeavesService } from "./leaveService";
import { SaleService } from "./saleService";
import { CustomerReturnService } from "./customerReturnService";
import { UserService } from "./userService";
import { OrdersService } from "./ordersService";

export const registerServices = (options) => {
  registerGlobalServices(options);

  serviceManager.register("AuthService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new AuthService(api);
  });

  serviceManager.register("StorageService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new StorageService(api);
  });

  serviceManager.register("ProductService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new ProductService(api);
  });

  serviceManager.register("EmployeeService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new EmployeeService(api);
  });

  serviceManager.register("SupplierService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new SupplierService(api);
  });

  serviceManager.register("LeavesService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new LeavesService(api);
  });

  serviceManager.register("SaleService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new SaleService(api);
  });

  serviceManager.register("CustomerReturnService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new CustomerReturnService(api);
  });

  serviceManager.register("UserService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new UserService(api);
  });

  serviceManager.register("OrdersService", (serviceManager) => {
    let api = serviceManager.get("ApiService");
    return new OrdersService(api);
  });
};

export { serviceManager };
