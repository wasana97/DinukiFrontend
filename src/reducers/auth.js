// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { USER_ROLES } from "constants/user";
import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_AUTH_INIT,
  HANDLE_NOTIFICATION,
  AUTH_SIGN_IN_SUCCESS,
  AUTH_SIGN_OUT_SUCCESS,
  AUTH_AUTHENTICATION_FAILURE,
} from "actionTypes/auth";

export type AuthStateType = {
  status: AsyncStatusType,
  notification: NotificationType,
  isAuthenticated: boolean,
  isUserInitiated: boolean,
  role: null | typeof USER_ROLES.ADMIN,
  isAuthSuccess: boolean,
  user: null | Object,
};

const initialState: AuthStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  isAuthenticated: false,
  isUserInitiated: true,
  role: USER_ROLES.ADMIN,
  isAuthSuccess: true,
  user: null,
};

function userInitiatedSuccess(state) {
  return state;
}

function asyncAuthInit(state: AuthStateType) {
  return {
    ...state,
    status: ASYNC_STATUS.LOADING,
    notification: null,
    isAuthSuccess: false,
    isEmailSent: false,
    isPasswordReset: false,
  };
}

function handleNotification(state: AuthStateType, { isSuccess, notification }) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

export default (
  state: AuthStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case "USER_INITIATED_SUCCESS":
      return userInitiatedSuccess(state, payload);
    case ASYNC_AUTH_INIT:
      return asyncAuthInit(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isAuthSuccess: true,
        user: payload,
        status: ASYNC_STATUS.SUCCESS,
      };
    case AUTH_SIGN_OUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isAuthSuccess: false,
        user: null,
        notification: null,
        status: ASYNC_STATUS.SUCCESS,
      };
    case AUTH_AUTHENTICATION_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        status: ASYNC_STATUS.FAILURE,
      };
    default:
      return state;
  }
};
