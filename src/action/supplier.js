// @flow
import {
  ASYNC_SUPPLIER_INIT,
  HANDLE_NOTIFICATION,
  GET_SUPPLIERS_SUCCESS,
  GET_SUPPLIER_SUCCESS,
} from "actionTypes/supplier";
import Alert from "components/Alert";

function asyncSupplierInit() {
  return {
    type: ASYNC_SUPPLIER_INIT,
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

export function addSupplier(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSupplierInit());

    let supplierService = serviceManager.get("SupplierService");

    supplierService
      .addSupplier(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Supplier Saved Successfully"
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

export function updateSupplier(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSupplierInit());

    let supplierService = serviceManager.get("SupplierService");

    supplierService
      .updateSupplier(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Supplier Updated Successfully"
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

export function getSuppliers(filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSupplierInit());

    let supplierService = serviceManager.get("SupplierService");

    supplierService
      .getSuppliers(filter)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_SUPPLIERS_SUCCESS, payload: data.item });
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

export function getSupplier(supplierCode: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSupplierInit());

    let supplierService = serviceManager.get("SupplierService");

    supplierService
      .getSupplier(supplierCode)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_SUPPLIER_SUCCESS, payload: data });
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

export function deleteSupplier(supplierCode: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSupplierInit());

    let supplierService = serviceManager.get("SupplierService");

    supplierService
      .deleteSupplier(supplierCode)
      .then(({ success }) => {
        if (success) {
          supplierService
            .getSuppliers({ page: 1, pageSize: 100 })
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_SUPPLIERS_SUCCESS, payload: data.item });
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
