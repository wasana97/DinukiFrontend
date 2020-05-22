// @flow
import {
  ASYNC_USER_INIT,
  HANDLE_NOTIFICATION,
  GET_USERS_SUCCESS,
  GET_USER_SUCCESS,
} from "actionTypes/user";
import Alert from "components/Alert";

function asyncUserInit() {
  return {
    type: ASYNC_USER_INIT,
  };
}

function notificationHandler(isSuccess, message) {
  return {
    type: HANDLE_NOTIFICATION,
    payload: {
      isSuccess,
      notification: {
        type: isSuccess ? Alert.TYPE.SUCCESS : Alert.TYPE.ERROR,
        message,
      },
    },
  };
}

export function updateUser(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncUserInit());

    let userService = serviceManager.get("UserService");

    userService
      .updateUser(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Profile Updated Successfully"
              : "Something went wrong. Please try again"
          )
        );
      })
      .catch(() => {
        dispatch(
          notificationHandler(false, "Something went wrong. Please try again")
        );
      });
  };
}

export function getAllUsers(filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncUserInit());

    let userService = serviceManager.get("UserService");

    userService
      .getAllUsers(filter)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_USERS_SUCCESS, payload: data.item });
        } else {
          dispatch(
            notificationHandler(
              success,
              "Something went wrong. Please try again"
            )
          );
        }
      })
      .catch(() => {
        dispatch(
          notificationHandler(false, "Something went wrong. Please try again")
        );
      });
  };
}

export function getUser(userId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncUserInit());

    let userService = serviceManager.get("UserService");

    userService
      .getUser(userId)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_USER_SUCCESS, payload: data });
        } else {
          dispatch(
            notificationHandler(
              success,
              "Something went wrong. Please try again"
            )
          );
        }
      })
      .catch(() => {
        dispatch(
          notificationHandler(false, "Something went wrong. Please try again")
        );
      });
  };
}

export function deleteUser(userId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncUserInit());

    let userService = serviceManager.get("UserService");

    userService
      .deleteUser(userId)
      .then(({ success }) => {
        if (success) {
          userService
            .getAllUsers({ page: 1, pageSize: 100 })
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_USERS_SUCCESS, payload: data.item });
              } else {
                dispatch(
                  notificationHandler(
                    success,
                    "Something went wrong. Please try again"
                  )
                );
              }
            })
            .catch(() => {
              dispatch(
                notificationHandler(
                  false,
                  "Something went wrong. Please try again"
                )
              );
            });
        } else {
          dispatch(
            notificationHandler(
              success,
              "Something went wrong. Please try again"
            )
          );
        }
      })
      .catch(() => {
        dispatch(
          notificationHandler(false, "Something went wrong. Please try again")
        );
      });
  };
}
