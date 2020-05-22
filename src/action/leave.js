// @flow
import {
  ASYNC_LEAVE_INIT,
  HANDLE_NOTIFICATION,
  GET_LEAVES_SUCCESS,
  INITIATE_LEAVE,
} from "actionTypes/leave";
import Alert from "components/Alert";

function asyncLeaveInit() {
  return {
    type: ASYNC_LEAVE_INIT,
  };
}

export function initializeLeave() {
  return (dispatch) => {
    dispatch({
      type: INITIATE_LEAVE,
    });
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

export function addLeave(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncLeaveInit());

    let leavesService = serviceManager.get("LeavesService");

    leavesService
      .addLeave(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Leave Saved Successfully"
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

export function getLeaves(filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncLeaveInit());

    let leavesService = serviceManager.get("LeavesService");

    leavesService
      .getLeaves(filter)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_LEAVES_SUCCESS, payload: data.item });
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
          notificationHandler(false, "There are no leaves under this employee")
        );
      });
  };
}

export function deleteLeave(leaveId: string, filter: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncLeaveInit());

    let leavesService = serviceManager.get("LeavesService");

    leavesService
      .deleteLeave(leaveId)
      .then(({ success }) => {
        if (success) {
          leavesService
            .getLeaves(filter)
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_LEAVES_SUCCESS, payload: data.item });
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
              ? "Leave Deleted Successfully"
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

export function onSalaryPayment(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncLeaveInit());

    let leavesService = serviceManager.get("LeavesService");

    leavesService
      .paySalary(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Salary Paid Successfully"
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
