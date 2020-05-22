// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { type AsyncStatusType } from "shared/types/General";

import Icon from "components/icon";
import Button from "components/button";

import { authSignOut } from "action/auth";
import { ASYNC_STATUS } from "constants/async";

import "./styles.scss";

type HeaderProps = {
  isAuthenticated: Boolean,
  toggleAuth: Function,
  displayAuth: boolean,
  user: Object,
  authSignOut: Function,
  status: AsyncStatusType
};

type HeaderState = {};

class Header extends PureComponent<HeaderProps, HeaderState> {
  render() {
    const { isAuthenticated, user, status } = this.props;
    return (
      <div className="header">
        <div className="menu">
          <ul>
            <li>
              <Icon icon="side-menu" />
            </li>
            <li>
              <Icon icon="notifications" />
            </li>
          </ul>
          <div className="profile">
            {isAuthenticated && user ? (
              <div className="avatar">
                <Icon icon="profile" />
                <label>{user.username ? user.username : "Unknown"}</label>
              </div>
            ) : (
              ""
            )}
            <div className="profile-container">
              {isAuthenticated ? (
                <Button
                  className="btn"
                  loading={status === ASYNC_STATUS.LOADING}
                  onClick={this.props.authSignOut}
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  className="btn"
                  onClick={this.props.toggleAuth}
                  loading={status === ASYNC_STATUS.LOADING}
                >
                  SignIn
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.auth.errors,
    isAuthSuccess: state.auth.isAuthSuccess,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    status: state.auth.status
  };
}

const Actions = { authSignOut };

export default connect(mapStateToProps, Actions)(Header);
