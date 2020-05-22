// @flow
import {
  ASYNC_CUSTOMER_RETURN_INIT,
  HANDLE_NOTIFICATION,
  GET_CUSTOMER_RETURN_SUCCESS,
  INITIALIZE_CUSTOMER_RETURN,
  GET_CUS_RETURN_SUCCESS,
} from "actionTypes/customerReturn";
import Alert from "components/Alert";

function asyncCustomerReturnInit() {
  return {
    type: ASYNC_CUSTOMER_RETURN_INIT,
  };
}

export function initializeCustomerReturn() {
  return {
    type: INITIALIZE_CUSTOMER_RETURN,
  };
}

export function notificationHandler(isSuccess, message) {
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

export function addCustomerReturn(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncCustomerReturnInit());

    let customerReturnService = serviceManager.get("CustomerReturnService");

    customerReturnService
      .addCustomerReturn(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Customer Return Placed Successfully"
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

export function updateCustomerReturn(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncCustomerReturnInit());

    let customerReturnService = serviceManager.get("CustomerReturnService");

    customerReturnService
      .updateCustomerReturn(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Customer Return Updated Successfully"
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

export function getCustomerReturn(returnId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncCustomerReturnInit());

    let customerReturnService = serviceManager.get("CustomerReturnService");

    customerReturnService
      .getCustomerReturn(returnId)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_CUS_RETURN_SUCCESS, payload: data });
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

export function getCustomerReturns(filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncCustomerReturnInit());

    let customerReturnService = serviceManager.get("CustomerReturnService");

    customerReturnService
      .getAllCustomerReturns(filter)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_CUSTOMER_RETURN_SUCCESS, payload: data.item });
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

export function deleteCustomerReturn(returnId: string, filter) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncCustomerReturnInit());

    let customerReturnService = serviceManager.get("CustomerReturnService");

    customerReturnService
      .deleteCustomerReturn(returnId)
      .then(({ success }) => {
        if (success) {
          customerReturnService
            .getAllCustomerReturns(filter)
            .then(({ success, data }) => {
              if (success) {
                dispatch({
                  type: GET_CUSTOMER_RETURN_SUCCESS,
                  payload: data.item,
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
                notificationHandler(
                  false,
                  "Something went wrong. Please try again"
                )
              );
            });
        }
        dispatch(
          notificationHandler(
            success,
            success
              ? "Customer Return Deleted Successfully"
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
