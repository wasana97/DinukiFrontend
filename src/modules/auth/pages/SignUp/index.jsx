// @flow
import React, { Component, Fragment } from "react";
import {
  type AsyncStatusType,
  type NotificationType
} from "shared/types/General";

import Input from "components/Input";
import Icon from "components/icon";
import Button from "components/button";
import Alert from "components/Alert";

import { ASYNC_STATUS } from "constants/async";
import { AUTH_TYPE } from "constants/auth";
import { hasWhiteSpace } from "shared/utils";
import { isEmail } from "shared/kernel/cast";
import Select from "components/Select";

type SignUpPageProps = {
  status: AsyncStatusType,
  notification: NotificationType,
  isCapsLockActive: boolean,
  toggleAuthType: Function,
  onSignUpSubmit: Function
};

type SignUpPageState = {
  values: {
    userName: string,
    email: string,
    gender: string,
    employeeNo: string,
    role: string,
    password: string,
    repeatPassword: string
  },
  errors: {
    userName: null | string,
    email: null | string,
    employeeNo: null | string,
    password: null | string,
    repeatPassword: null | string
  }
};

class SignUpPage extends Component<SignUpPageProps, SignUpPageState> {
  constructor(props) {
    super(props);

    this.state = {
      values: {
        userName: "",
        email: "",
        gender: "Male",
        employeeNo: "",
        role: "Admin",
        password: "",
        repeatPassword: ""
      },
      errors: {
        userName: null,
        email: null,
        employeeNo: null,
        password: null,
        repeatPassword: null
      }
    };
    // $FlowFixMe
    this.resetForm = this.resetForm.bind(this);
    // $FlowFixMe
    this.validateForm = this.validateForm.bind(this);
    // $FlowFixMe
    this.setFormErrors = this.setFormErrors.bind(this);
    // $FlowFixMe
    this.handleInputChange = this.handleInputChange.bind(this);
    // $FlowFixMe
    this.toggleAuthType = this.toggleAuthType.bind(this);
    // $FlowFixMe
    this.onSubmitForm = this.onSubmitForm.bind(this);
    // $FlowFixMe
    this.onEnterKeyPress = this.onEnterKeyPress.bind(this);
  }

  componentDidMount() {
    this.resetForm();
  }

  resetForm() {
    this.setState({
      errors: {
        userName: null,
        email: null,
        employeeNo: null,
        password: null,
        repeatPassword: null
      }
    });
  }

  validateForm() {
    const {
      values: { userName, email, employeeNo, password, repeatPassword }
    } = this.state;

    let hasError = false;

    this.resetForm();

    if (userName === "") {
      this.setFormErrors("userName", "userName is required.");
      hasError = true;
    }
    if (email === "") {
      this.setFormErrors("email", "Email is required.");
      hasError = true;
    } else if (hasWhiteSpace(email)) {
      this.setFormErrors("email", "Email cannot contain spaces.");
      hasError = true;
    } else if (!isEmail(email)) {
      this.setFormErrors("email", "Email is invalid.");
      hasError = true;
    }

    if (employeeNo === "") {
      this.setFormErrors("employeeNo", "employeeNo Name is required.");
      hasError = true;
    }

    if (password === "") {
      this.setFormErrors("password", "Password is required.");
      hasError = true;
    } else if (password !== repeatPassword) {
      this.setFormErrors(
        "repeatPassword",
        "Password and Repeat password does not match."
      );
      hasError = true;
    }
    return hasError;
  }

  onEnterKeyPress(event) {
    if (event.key === "Enter") {
      this.onSubmitForm();
    }
  }

  onSubmitForm() {
    if (!this.validateForm()) {
      const {
        values: { userName, email, gender, employeeNo, role, password }
      } = this.state;

      this.props.onSignUpSubmit({
        username: userName,
        email: email.toLowerCase(),
        gender,
        employeeNumber: employeeNo,
        role,
        password
      });
    }
  }

  setFormErrors(field: string, message: string) {
    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        [field]: message
      }
    }));
  }

  handleInputChange(value) {
    this.setState(({ values }) => ({
      values: {
        ...values,
        ...value
      }
    }));
  }

  toggleAuthType(authType: string) {
    const { toggleAuthType } = this.props;

    this.resetForm();
    toggleAuthType(authType);
  }

  render() {
    const { values, errors } = this.state;
    const { isCapsLockActive, status, notification } = this.props;

    return (
      <Fragment>
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        <form autoComplete="off">
          <div className="form-group">
            <label>Username</label>
            <Input
              id="userName"
              text={values.userName}
              onChange={userName => this.handleInputChange({ userName })}
              error={errors.userName}
              autoComplete={false}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <Select
              id="gender"
              options={["Male", "Female"]}
              selected={values.gender}
              onChange={gender => this.handleInputChange({ gender })}
              autoComplete={false}
            />
          </div>
          <div className="form-group">
            <label>Employee Number</label>
            <Input
              id="employeeNumber"
              text={values.employeeNo}
              onChange={employeeNo => this.handleInputChange({ employeeNo })}
              error={errors.employeeNo}
              autoComplete={false}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <Select
              id="role"
              options={["Admin", "Store Keeper", "Cashier"]}
              selected={values.role}
              onChange={role => this.handleInputChange({ role })}
              autoComplete={false}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <Input
              placeholder="Eg: user@example.com"
              id="email"
              text={values.email}
              onChange={email => this.handleInputChange({ email })}
              error={errors.email}
              autoComplete={false}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <Input
              placeholder="at least 6 characters including a number, a special character, lower case and upper case letters."
              id="password"
              text={values.password}
              onChange={password => this.handleInputChange({ password })}
              type="password"
              error={errors.password}
              autoComplete={false}
            />
            {isCapsLockActive && (
              <span className="warning">
                <Icon icon="exclamation-circle" />
                &nbsp; Warning: Caps lock enabled.
              </span>
            )}
          </div>
          <div className="form-group">
            <label>Repeat Password</label>
            <Input
              placeholder="repeat password"
              id="repeatPassword"
              text={values.repeatPassword}
              onChange={repeatPassword =>
                this.handleInputChange({ repeatPassword })
              }
              type="password"
              error={errors.repeatPassword}
              autoComplete={false}
              onKeyPress={this.onEnterKeyPress}
            />
            {isCapsLockActive && (
              <span className="warning">
                <Icon icon="exclamation-circle" />
                &nbsp; Warning: Caps lock enabled.
              </span>
            )}
          </div>
        </form>

        <div className="button-container">
          <Button
            htmlType={Button.HTML_TYPE.BUTTON}
            onClick={this.onSubmitForm}
            loading={status === ASYNC_STATUS.LOADING}
          >
            SignUp
          </Button>
        </div>
        <Fragment>
          <div className="secondary-link">
            Already have an account? &nbsp;
            <span
              onClick={() => this.toggleAuthType(AUTH_TYPE.SIGN_IN)}
              className="link"
            >
              SignIn
            </span>
          </div>
        </Fragment>
      </Fragment>
    );
  }
}

export default SignUpPage;
