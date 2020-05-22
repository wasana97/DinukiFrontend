// @flow
import {
  ASYNC_PRODUCT_INIT,
  HANDLE_NOTIFICATION,
  GET_PRODUCTS_SUCCESS,
  INIT_PRODUCT,
  INITIALIZE_PRODUCT,
  GET_PRODUCT_SUCCESS,
} from "actionTypes/product";
import Alert from "components/Alert";

function asyncProductInit() {
  return {
    type: ASYNC_PRODUCT_INIT,
  };
}

export function initializeProduct() {
  return (dispatch) => {
    dispatch({ type: INITIALIZE_PRODUCT });
  };
}

export function initProduct() {
  return (dispatch) => {
    dispatch({ type: INIT_PRODUCT });
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

export function addProduct(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncProductInit());

    let productService = serviceManager.get("ProductService");

    productService
      .addProduct(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Product Saved Successfully"
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

export function updateProduct(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncProductInit());

    let productService = serviceManager.get("ProductService");

    productService
      .updateProduct(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Product Updated Successfully"
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

export function getProducts(filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncProductInit());

    let productService = serviceManager.get("ProductService");

    productService
      .getProducts(filter)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_PRODUCTS_SUCCESS, payload: data.item });
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

export function getProduct(orderNumber: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncProductInit());

    let productService = serviceManager.get("ProductService");

    productService
      .getProduct(orderNumber)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_PRODUCT_SUCCESS, payload: data });
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

export function deleteProduct(productCode: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncProductInit());

    let productService = serviceManager.get("ProductService");

    productService
      .deleteProduct(productCode)
      .then(({ success }) => {
        if (success) {
          productService
            .getProducts({ page: 1, pageSize: 100 })
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_PRODUCTS_SUCCESS, payload: data.item });
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
              ? "Product Deleted Successfully"
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
