// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_ORDERS_INIT,
  HANDLE_NOTIFICATION,
  GET_ORDERS_SUCCESS,
  GET_ORDER_SUCCESS,
  INIT_ORDERS,
} from "actionTypes/order";

export type OrdersStateType = {
  status: AsyncStatusType,
  notification: NotificationType,
  orders: Array<any>,
  order: Object | null,
};

const initialState: OrdersStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  orders: [],
  order: null,
};

function asyncOrdersInit(state: OrdersStateType) {
  return {
    ...state,
    status: ASYNC_STATUS.LOADING,
    notification: null,
  };
}

function getOrderSuccess(
  state,
  {
    orderId,
    supplierCode,
    productCode,
    productName,
    size,
    price,
    color,
    quantity,
  }
) {
  return {
    ...state,
    status: ASYNC_STATUS.SUCCESS,
    order: {
      orderId,
      supplierCode,
      productCode,
      productName,
      size,
      price,
      color,
      quantity,
    },
  };
}

function handleNotification(
  state: OrdersStateType,
  { isSuccess, notification }
) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

export default (
  state: OrdersStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_ORDERS_INIT:
      return asyncOrdersInit(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case INIT_ORDERS:
      return {
        ...state,
        status: ASYNC_STATUS.INIT,
        notification: null,
      };
    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        status: ASYNC_STATUS.SUCCESS,
        orders: payload,
      };
    case GET_ORDER_SUCCESS:
      return getOrderSuccess(state, payload);
    default:
      return state;
  }
};
