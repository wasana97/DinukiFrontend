// @flow
import {
  ASYNC_SALE_INIT,
  HANDLE_NOTIFICATION,
  GET_SALES_SUCCESS
} from "actionTypes/sale";
import Alert from "components/Alert";

function asyncSaleInit() {
  return {
    type: ASYNC_SALE_INIT
  };
}

export function notificationHandler(isSuccess, message) {
  return {
    type: HANDLE_NOTIFICATION,
    payload: {
      isSuccess,
      notification: {
        type: isSuccess ? Alert.TYPE.SUCCESS : Alert.TYPE.ERROR,
        message
      }
    }
  };
}

export function addSaleOrder(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSaleInit());

    let saleService = serviceManager.get("SaleService");

    saleService
      .addSaleOrder(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Sale Placed Successfully"
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

export function getSales(filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSaleInit());

    let saleService = serviceManager.get("SaleService");

    saleService
      .getAllSales(filter)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_SALES_SUCCESS, payload: data.item });
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

export function deleteSaleOrder(saleId: string, filters) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSaleInit());

    let saleService = serviceManager.get("SaleService");

    saleService
      .deleteSaleOrder(saleId)
      .then(({ success }) => {
        if (success) {
          saleService
            .getAllSales(filters)
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_SALES_SUCCESS, payload: data.item });
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
              ? "Sale Deleted Successfully"
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
