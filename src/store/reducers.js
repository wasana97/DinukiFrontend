// @flow
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import auth, { type AuthStateType } from "reducers/auth";
import product, { type ProductStateType } from "reducers/product";
import employee, { type EmployeeStateType } from "reducers/employee";
import supplier, { type SupplierStateType } from "reducers/supplier";
import leave, { type LeaveStateType } from "reducers/leave";
import sale, { type SaleStateType } from "reducers/sale";
import customerReturn, {
  type CustomerReturnStateType,
} from "reducers/customerReturn";
import user, { type UserStateType } from "reducers/user";
import order, { type OrdersStateType } from "reducers/orders";

export type ApplicationState = {
  auth: AuthStateType,
  product: ProductStateType,
  employee: EmployeeStateType,
  supplier: SupplierStateType,
  leave: LeaveStateType,
  sale: SaleStateType,
  customerReturn: CustomerReturnStateType,
  user: UserStateType,
  order: OrdersStateType,
};

export default (history: History) =>
  combineReducers({
    auth,
    product,
    employee,
    supplier,
    leave,
    sale,
    customerReturn,
    user,
    order,
    router: connectRouter(history),
  });
