// @flow
import React, { Component, Fragment } from "react";
import { type NotificationType } from "shared/types/General";

import Layout from "components/adminLayout";
import Button from "components/button";
import Row from "components/Row";
import Col from "components/Col";
import Input from "components/Input";
import Alert from "components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import { isEmpty } from "shared/utils";
import Select from "components/Select";

type AdminUpdateUserFormPageProps = {
  updateUser: Function,
  notification: NotificationType,
  user: Object,
};

type AdminUpdateUserFormPageState = {
  form: {
    _id: string,
    username: string,
    email: string,
    employeeNumber: string,
    gender: string,
    role: string,
  },
  errors: {
    employeeNumber: null | string,
  },
};

class AdminUpdateUserFormPage extends Component<
  AdminUpdateUserFormPageProps,
  AdminUpdateUserFormPageState
  > {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        ...this.props.user,
      },
      errors: {
        employeeNumber: null,
      },
    };

    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.resetUser = this.resetUser.bind(this);
    // $FlowFixMe
    this.onChangeFormField = this.onChangeFormField.bind(this);
    // $FlowFixMe
    this.resetFormErrors = this.resetFormErrors.bind(this);
    // $FlowFixMe
    this.setFormErrors = this.setFormErrors.bind(this);
    // $FlowFixMe
    this.onSubmitForm = this.onSubmitForm.bind(this);
    // $FlowFixMe
    this.validateForm = this.validateForm.bind(this);
  }

  confirmationMessage() {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to update this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.onSubmitForm();
          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { employeeNumber },
    } = this.state;

    let hasError = false;

    if (employeeNumber === "") {
      this.setFormErrors("employeeNumber", "employeeNumber is required.");
      hasError = true;
    }

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        employeeNumber: null,
      },
    });
  }

  setFormErrors(field: string, message: string) {
    this.setState(({ errors }) => {
      return {
        errors: {
          ...errors,
          [field]: message,
        },
      };
    });
  }

  resetUser() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...this.props.user,
      },
    }));
  }

  onChangeFormField(value) {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...value,
      },
    }));
  }

  onSubmitForm() {
    const { form } = this.state;

    if (!this.validateForm()) {
      this.props.updateUser({ ...form });
    }
  }

  render() {
    const {
      form: { _id, username, email, employeeNumber, gender, role },
      errors,
    } = this.state;

    const { notification } = this.props;

    return (
      <Layout
        breadcrumbs={["Update Supplier"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetSupplier}>
              Reset
            </Button>
            <Button
              type={Button.TYPE.SUCCESS}
              disabled={isEmpty(_id)}
              onClick={this.confirmationMessage}
            >
              Update
            </Button>
          </Fragment>
        }
      >
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}

        <div className="add-user">
          <div className="add-user-container">
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Username
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="username" text={username} disabled />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Email
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="email" text={email} disabled />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Employee Number
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      id="employeeNumber"
                      text={employeeNumber}
                      onChange={(employeeNumber) =>
                        this.onChangeFormField({ employeeNumber })
                      }
                      error={errors.employeeNumber}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Gender
                  </Col>
                  <Col sm={12} md={6}>
                    <Select
                      id="gender"
                      options={["Male", "Female"]}
                      selected={gender}
                      onChange={(gender) => this.onChangeFormField({ gender })}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Role
                  </Col>
                  <Col sm={12} md={6}>
                    <Select
                      id="role"
                      options={["Admin", "Store Keeper", "Cashier"]}
                      selected={role}
                      onChange={(role) => this.onChangeFormField({ role })}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </Layout>
    );
  }
}

export default AdminUpdateUserFormPage;
