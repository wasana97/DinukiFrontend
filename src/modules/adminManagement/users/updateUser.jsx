// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Loader from "components/loader";
import UpdateUserForm from "./component/updateUserForm";

import { ASYNC_STATUS } from "constants/async";
import { getUser, updateUser } from "action/user";

import "./styles.scss";

type AdminUpdateUserPageProps = {
  getUser: Function,
  updateUser: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  user: Object | null,
  match: {
    params: {
      userId: number,
    },
  },
};

class AdminUpdateUserPage extends Component<AdminUpdateUserPageProps> {
  componentDidMount() {
    const {
      match: {
        params: { userId },
      },
    } = this.props;

    this.props.getUser(userId);
  }

  render() {
    const {
      status,
      notification,
      updateUser,
      user,
      match: {
        params: { userId },
      },
    } = this.props;

    if (status === ASYNC_STATUS.LOADING) {
      return <Loader isLoading />;
    }

    return (
      <Fragment>
        {user && user._id === userId && (
          <UpdateUserForm
            notification={notification}
            updateUser={updateUser}
            user={user}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.user.status,
    notification: state.user.notification,
    user: state.user.user,
  };
}

const Actions = {
  getUser,
  updateUser,
};

export default connect(mapStateToProps, Actions)(AdminUpdateUserPage);
