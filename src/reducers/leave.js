// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_LEAVE_INIT,
  HANDLE_NOTIFICATION,
  GET_LEAVES_SUCCESS,
  INITIATE_LEAVE,
} from "actionTypes/leave";

export type LeaveStateType = {
  status: AsyncStatusType,
  notification: NotificationType,
  leaves: Array<any>,
};

const initialState: LeaveStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  leaves: [],
};

function asyncLeaveInit(state: LeaveStateType) {
  return {
    ...state,
    status: ASYNC_STATUS.LOADING,
    notification: null,
  };
}

function handleNotification(
  state: LeaveStateType,
  { isSuccess, notification }
) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

export default (
  state: LeaveStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_LEAVE_INIT:
      return asyncLeaveInit(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_LEAVES_SUCCESS:
      return {
        ...state,
        status: ASYNC_STATUS.SUCCESS,
        leaves: payload,
      };
    case INITIATE_LEAVE:
      return {
        ...state,
        status: ASYNC_STATUS.INIT,
        notification: null,
        leaves: [],
      };
    default:
      return state;
  }
};
