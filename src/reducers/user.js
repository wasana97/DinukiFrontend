// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_USER_INIT,
  HANDLE_NOTIFICATION,
  GET_USERS_SUCCESS,
  GET_USER_SUCCESS,
} from "actionTypes/user";

export type UserStateType = {
  status: AsyncStatusType,
  notification: NotificationType,
  users: Array<any>,
  user: null | Object,
};

const initialState: UserStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  users: [],
  user: null,
};

function asyncUsersInit(state: UserStateType) {
  return {
    ...state,
    status: ASYNC_STATUS.LOADING,
    notification: null,
  };
}

function getUserSuccess(
  state,
  { _id, username, email, employeeNumber, gender, role }
) {
  return {
    ...state,
    status: ASYNC_STATUS.SUCCESS,
    user: {
      _id,
      username,
      email,
      employeeNumber,
      gender,
      role,
    },
  };
}

function handleNotification(state: UserStateType, { isSuccess, notification }) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

export default (
  state: UserStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_USER_INIT:
      return asyncUsersInit(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_USERS_SUCCESS:
      return {
        ...state,
        status: ASYNC_STATUS.SUCCESS,
        users: payload,
      };
    case GET_USER_SUCCESS:
      return getUserSuccess(state, payload);
    default:
      return state;
  }
};
