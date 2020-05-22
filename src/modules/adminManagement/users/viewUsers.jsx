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

import { getAllUsers, deleteUser } from "action/user";
import { ASYNC_STATUS } from "constants/async";
import { filters } from "constants/user";
import { Link } from "react-router-dom";

import "./styles.scss";

type AdminViewUsersPageProps = {
  getAllUsers: Function,
  deleteUser: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  users: Array<any>,
};

class AdminViewUserPage extends Component<AdminViewUsersPageProps> {
  constructor(props) {
    super(props);

    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    this.props.getAllUsers({ ...filters });
  }

  confirmationMessage(userId) {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to delete this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteUser(userId);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  deleteUser(userId) {
    this.props.deleteUser(userId);
  }

  render() {
    const { status, notification, users } = this.props;

    return (
      <Layout
        breadcrumbs={["View Users"]}
        actions={
          <Fragment>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="dataTable"
              filename="User Report"
              sheet="user_report"
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
          <div className="view-user">
            <div className="table-container">
              <div className="table-section">
                <table id="dataTable">
                  <tbody>
                    <tr className="table-heading">
                      <th>Username</th>
                      <th>Email</th>
                      <th>Employee Number</th>
                      <th>Gender</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                    {users.length > 0 &&
                      users.map((user) => {
                        return (
                          <tr key={user.email}>
                            <td>
                              <Link to={`/admin/users/update/${user._id}`}>
                                {user.username}
                              </Link>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.employeeNumber}</td>
                            <td>{user.gender}</td>
                            <td>{user.role}</td>
                            <td>
                              <Button
                                type={Button.TYPE.DANGER}
                                onClick={() =>
                                  this.confirmationMessage(user._id)
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
    status: state.user.status,
    notification: state.user.notification,
    users: state.user.users,
  };
}

const Actions = {
  getAllUsers,
  deleteUser,
};

export default connect(mapStateToProps, Actions)(AdminViewUserPage);
