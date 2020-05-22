// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/adminLayout";
import Button from "components/button";
import Loader from "components/loader";
import Alert from "components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import { getEmployees, deleteEmployee } from "action/employee";
import { ASYNC_STATUS } from "constants/async";
import { filters } from "constants/user";

import "./styles.scss";
import { Link } from "react-router-dom";

type AdminViewEmployeePageProps = {
  getEmployees: Function,
  deleteEmployee: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  employees: Array<any>,
};

type AdminViewEmployeePageState = {
  filters: {
    employeeName: string,
    employeeType: string,
    nic: string,
  },
};
class AdminViewEmployeePage extends Component<
  AdminViewEmployeePageProps,
  AdminViewEmployeePageState
> {
  constructor(props) {
    super(props);

    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.deleteEmployee = this.deleteEmployee.bind(this);
  }

  componentDidMount() {
    this.props.getEmployees({ ...filters });
  }

  confirmationMessage(employeeId) {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to delete this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteEmployee(employeeId);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  deleteEmployee(employeeId) {
    this.props.deleteEmployee(employeeId);
  }

  render() {
    const { status, notification, employees } = this.props;

    return (
      <Layout
        breadcrumbs={["View Employees"]}
        actions={
          <Fragment>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="dataTable"
              filename="Employee Report"
              sheet="employee_report"
              buttonText="Generate Report"
            />
          </Fragment>
        }
      >
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {status === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="view-employee">
            <div className="table-container">
              <div className="table-section">
                <table id="dataTable">
                  <tbody>
                    <tr className="table-heading">
                      <th>Employee Id</th>
                      <th>Employee Name</th>
                      <th>Employee Type</th>
                      <th>Contact Number</th>
                      <th>Address</th>
                      <th>NIC</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                    {employees.length > 0 &&
                      employees.map((employee) => {
                        return (
                          <tr key={employee.employeeId}>
                            <td>
                              <Link
                                to={`/admin/employees/update/${employee.employeeId}`}
                              >
                                {employee.employeeId}
                              </Link>
                            </td>
                            <td>{employee.employeeName}</td>
                            <td>{employee.employeeType}</td>
                            <td>{employee.contactNumber}</td>
                            <td>{employee.address}</td>
                            <td>{employee.nic}</td>
                            <td>{employee.email}</td>
                            <td>
                              <Button
                                type={Button.TYPE.DANGER}
                                onClick={() =>
                                  this.confirmationMessage(employee.employeeId)
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.employee.status,
    notification: state.employee.notification,
    employees: state.employee.employees,
  };
}

const Actions = {
  getEmployees,
  deleteEmployee,
};

export default connect(mapStateToProps, Actions)(AdminViewEmployeePage);
