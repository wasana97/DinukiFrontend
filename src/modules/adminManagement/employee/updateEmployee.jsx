// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Loader from "components/loader";
import UpdateEmployeeForm from "./component/updateEmployeeForm";

import { ASYNC_STATUS } from "constants/async";
import { getEmployee, updateEmployee } from "action/employee";

import "./styles.scss";

type AdminUpdateEmployeePageProps = {
  getEmployee: Function,
  updateEmployee: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  employee: Object | null,
  match: {
    params: {
      employeeId: number,
    },
  },
};
class AdminUpdateEmployeePage extends Component<AdminUpdateEmployeePageProps> {
  componentDidMount() {
    const {
      match: {
        params: { employeeId },
      },
    } = this.props;

    this.props.getEmployee(employeeId);
  }

  render() {
    const {
      status,
      notification,
      updateEmployee,
      employee,
      match: {
        params: { employeeId },
      },
    } = this.props;

    if (status === ASYNC_STATUS.LOADING) {
      return <Loader isLoading />;
    }

    return (
      <Fragment>
        {employee && employee.employeeId === employeeId && (
          <UpdateEmployeeForm
            notification={notification}
            updateEmployee={updateEmployee}
            employee={employee}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.employee.status,
    notification: state.employee.notification,
    employee: state.employee.employee,
  };
}

const Actions = {
  getEmployee,
  updateEmployee,
};

export default connect(mapStateToProps, Actions)(AdminUpdateEmployeePage);
