// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  type AsyncStatusType,
  type NotificationType
} from "shared/types/General";

import SignInPage from "../SignIn";
import SignUpPage from "../SignUp";

import { AUTH_TYPE } from "constants/auth";
import { authSignUp, authSignIn } from "action/auth";

import "./styles.scss";

const EVENT_KEY_UP = "keyup";

type AuthBlockProps = {
  isAuthSuccess: boolean,
  isAuthenticated: boolean,
  status: AsyncStatusType,
  notification: NotificationType,
  toggleAuth: Function,
  clearNotifications: Function,
  authSignUp: Function,
  authSignIn: Function
};

type AuthBlockState = {
  authState: typeof AUTH_TYPE.SIGN_IN | typeof AUTH_TYPE.SIGN_UP,
  isLoading: Boolean,
  error: string | null,
  isCapsLockActive: boolean
};

class AuthBlock extends PureComponent<AuthBlockProps, AuthBlockState> {
  state = {
    authState: AUTH_TYPE.SIGN_IN,
    isLoading: false,
    error: null,
    isCapsLockActive: false
  };

  componentDidMount() {
    document.addEventListener(EVENT_KEY_UP, this._wasCapsLockDeactivated);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isAuthSuccess } = this.props;

    if (isAuthSuccess !== prevProps.isAuthSuccess && isAuthSuccess) {
      prevState.authState === AUTH_TYPE.SIGN_UP &&
        this.setState({ authState: AUTH_TYPE.SIGN_IN });
    }
  }

  componentWillUnmount() {
    document.removeEventListener(EVENT_KEY_UP, this._wasCapsLockDeactivated);
  }

  _wasCapsLockDeactivated = (event: any) => {
    if (event.getModifierState) {
      this.setState({
        isCapsLockActive:
          event.getModifierState("CapsLock") &&
          this.state.isCapsLockActive === false
      });
    }
  };

  _getFormFields = () => {
    const { authState, isCapsLockActive } = this.state;
    const { status, notification, authSignUp, authSignIn } = this.props;

    switch (authState) {
      case AUTH_TYPE.SIGN_UP:
        return (
          <SignUpPage
            status={status}
            notification={notification}
            isCapsLockActive={isCapsLockActive}
            toggleAuthType={this._toggleAuthType}
            onSignUpSubmit={authSignUp}
          />
        );
      default:
        return (
          <SignInPage
            status={status}
            notification={notification}
            isCapsLockActive={isCapsLockActive}
            toggleAuthType={this._toggleAuthType}
            onSignInSubmit={authSignIn}
          />
        );
    }
  };

  _toggleAuthType = authState => {
    if (authState !== undefined) {
      this.setState({
        authState
      });
    }
  };

  render() {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-body">
            <div className="sub-heading">Please login or create an account</div>
            {this._getFormFields()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthSuccess: state.auth.isAuthSuccess,
    isAuthenticated: state.auth.isAuthenticated,
    status: state.auth.status,
    notification: state.auth.notification
  };
}

const Actions = {
  authSignUp,
  authSignIn
};

export default connect(
  mapStateToProps,
  Actions
)(AuthBlock);
