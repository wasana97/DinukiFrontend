// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_SALE_INIT,
  HANDLE_NOTIFICATION,
  GET_SALES_SUCCESS
} from "actionTypes/sale";

export type SaleStateType = {
  status: AsyncStatusType,
  notification: NotificationType,
  sales: Array<any>
};

const initialState: SaleStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  sales: []
};

function asyncSalesInit(state: SaleStateType) {
  return {
    ...state,
    status: ASYNC_STATUS.LOADING,
    notification: null
  };
}

function handleNotification(state: SaleStateType, { isSuccess, notification }) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE
  };
}

export default (
  state: SaleStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_SALE_INIT:
      return asyncSalesInit(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_SALES_SUCCESS:
      return {
        ...state,
        status: ASYNC_STATUS.SUCCESS,
        sales: payload
      };
    default:
      return state;
  }
};
