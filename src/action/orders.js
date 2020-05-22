// @flow
import {
  ASYNC_ORDERS_INIT,
  HANDLE_NOTIFICATION,
  INIT_ORDERS,
  GET_ORDERS_SUCCESS,
  GET_ORDER_SUCCESS,
} from "actionTypes/order";
import Alert from "components/Alert";

function asyncOrdersInit() {
  return {
    type: ASYNC_ORDERS_INIT,
  };
}

export function initializeOrder() {
  return (dispatch) => {
    dispatch({ type: INIT_ORDERS });
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

export function addOrders(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncOrdersInit());

    let ordersService = serviceManager.get("OrdersService");

    ordersService
      .addOrders(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Order Placed Successfully"
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

export function updateOrders(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncOrdersInit());

    let ordersService = serviceManager.get("OrdersService");

    ordersService
      .updateOrders(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Order Updated Successfully"
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

export function getOrders(filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncOrdersInit());

    let ordersService = serviceManager.get("OrdersService");

    ordersService
      .getOrders(filter)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_ORDERS_SUCCESS, payload: data.item });
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

export function getOrder(orderNumber: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncOrdersInit());

    let ordersService = serviceManager.get("OrdersService");

    ordersService
      .getOrder(orderNumber)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_ORDER_SUCCESS, payload: data });
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

export function deleteOrders(orderId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncOrdersInit());

    let ordersService = serviceManager.get("OrdersService");

    ordersService
      .deleteOrders(orderId)
      .then(({ success }) => {
        if (success) {
          ordersService
            .getOrders({ page: 1, pageSize: 100 })
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_ORDERS_SUCCESS, payload: data.item });
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
              ? "Order Deleted Successfully"
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
