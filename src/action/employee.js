// @flow
import {
  ASYNC_EMPLOYEE_INIT,
  HANDLE_NOTIFICATION,
  GET_EMPLOYEE_SUCCESS,
  INIT_EMPLOYEE,
  INITIALIZE_EMPLOYEE,
  GET_EMP_SUCCESS,
} from "actionTypes/employee";
import Alert from "components/Alert";

function asyncEmployeeInit() {
  return {
    type: ASYNC_EMPLOYEE_INIT,
  };
}

export function initializeEmployee() {
  return (dispatch) => {
    dispatch({ type: INITIALIZE_EMPLOYEE });
  };
}

export function initEmployee() {
  return (dispatch) => {
    dispatch({ type: INIT_EMPLOYEE });
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

export function addEmployee(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncEmployeeInit());

    let employeeService = serviceManager.get("EmployeeService");

    employeeService
      .addEmployee(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Employee Saved Successfully"
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

export function updateEmployee(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncEmployeeInit());

    let employeeService = serviceManager.get("EmployeeService");

    employeeService
      .updateEmployee(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Employee Updated Successfully"
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

export function getEmployees(filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncEmployeeInit());

    let employeeService = serviceManager.get("EmployeeService");

    employeeService
      .getEmployees(filter)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_EMPLOYEE_SUCCESS, payload: data.item });
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

export function getEmployee(EmployeeId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncEmployeeInit());

    let employeeService = serviceManager.get("EmployeeService");

    employeeService
      .getEmployee(EmployeeId)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_EMP_SUCCESS, payload: data });
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

export function deleteEmployee(employeeId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncEmployeeInit());

    let employeeService = serviceManager.get("EmployeeService");

    employeeService
      .deleteEmployee(employeeId)
      .then(({ success }) => {
        if (success) {
          employeeService
            .getEmployees({ page: 1, pageSize: 100 })
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_EMPLOYEE_SUCCESS, payload: data.item });
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
