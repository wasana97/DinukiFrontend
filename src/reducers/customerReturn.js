// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_CUSTOMER_RETURN_INIT,
  HANDLE_NOTIFICATION,
  GET_CUSTOMER_RETURN_SUCCESS,
  INITIALIZE_CUSTOMER_RETURN,
  GET_CUS_RETURN_SUCCESS,
} from "actionTypes/customerReturn";

export type CustomerReturnStateType = {
  status: AsyncStatusType,
  notification: NotificationType,
  customerReturns: Array<any>,
  customerReturn: null | Object,
};

const initialState: CustomerReturnStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  customerReturns: [],
  customerReturn: null,
};

function asyncCustomerReturnInit(state: CustomerReturnStateType) {
  return {
    ...state,
    status: ASYNC_STATUS.LOADING,
    notification: null,
  };
}

function getCustomerReturnSuccess(
  state,
  {
    returnId,
    productCode,
    ProductName,
    size,
    color,
    quantity,
    reason,
    cashierId,
    date,
  }
) {
  return {
    ...state,
    status: ASYNC_STATUS.SUCCESS,
    customerReturn: {
      returnId,
      productCode,
      ProductName,
      size,
      color,
      quantity,
      reason,
      cashierId,
      date,
    },
  };
}

function handleNotification(
  state: CustomerReturnStateType,
  { isSuccess, notification }
) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

export default (
  state: CustomerReturnStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_CUSTOMER_RETURN_INIT:
      return asyncCustomerReturnInit(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_CUS_RETURN_SUCCESS:
      return getCustomerReturnSuccess(state, payload);
    case GET_CUSTOMER_RETURN_SUCCESS:
      return {
        ...state,
        status: ASYNC_STATUS.SUCCESS,
        customerReturns: payload,
      };
    case INITIALIZE_CUSTOMER_RETURN:
      return {
        ...state,
        status: ASYNC_STATUS.INIT,
        notification: null,
      };
    default:
      return state;
  }
};
