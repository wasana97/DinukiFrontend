// @flow
import {
  ASYNC_AUTH_INIT,
  HANDLE_NOTIFICATION,
  AUTH_SIGN_IN_SUCCESS,
  AUTH_SIGN_OUT_SUCCESS,
  AUTH_AUTHENTICATION_FAILURE,
} from "actionTypes/auth";
import Alert from "components/Alert";

function asyncAuthInit() {
  return {
    type: ASYNC_AUTH_INIT,
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

export function authSignUp(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncAuthInit());

    let authService = serviceManager.get("AuthService");

    authService
      .signUp(payload)
      .then(({ success, data }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "User registered successfully"
              : data.errorMessage
              ? data.errorMessage
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

export function authSignIn(payload) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncAuthInit());

    let authService = serviceManager.get("AuthService");

    authService
      .signIn(payload)
      .then(({ success, data }) => {
        if (success) {
          serviceManager.get("ApiService").authToken = data.token;
          localStorage.setItem("token", data.token);
          dispatch({ type: AUTH_SIGN_IN_SUCCESS, payload: data.user });
        } else {
          dispatch(
            notificationHandler(false, "Username or password is incorrect")
          );
        }
      })
      .catch(({ message }) => {
        dispatch(
          notificationHandler(
            false,
            message ? message : "Something went wrong. Please try again"
          )
        );
      });
  };
}

export function isUserAuthenticated() {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncAuthInit());

    let authService = serviceManager.get("AuthService");

    const token = localStorage.getItem("token");

    if (token) {
      serviceManager.get("ApiService").authToken = token;

      authService
        .getCurrentUser()
        .then(({ success, data }) => {
          if (success) {
            dispatch({ type: AUTH_SIGN_IN_SUCCESS, payload: data });
          } else {
            dispatch({ type: AUTH_AUTHENTICATION_FAILURE });
          }
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.log("Session Expired!");
          dispatch({ type: AUTH_AUTHENTICATION_FAILURE });
        });
    } else {
      // eslint-disable-next-line no-console
      console.log("Session Expired!");
      dispatch({ type: AUTH_AUTHENTICATION_FAILURE });
    }
  };
}

export function authSignOut() {
  return (dispatch) => {
    localStorage.removeItem("token");
    dispatch({ type: AUTH_SIGN_OUT_SUCCESS });
  };
}
