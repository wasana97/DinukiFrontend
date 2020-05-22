// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/adminLayout";
import Button from "components/button";
import Row from "components/Row";
import Col from "components/Col";
import Input from "components/Input";
import Alert from "components/Alert";
import Loader from "components/loader";

import { addEmployee, initializeEmployee } from "action/employee";
import { serviceManager } from "services/manager";
import { isEmpty } from "shared/utils";
import { ASYNC_STATUS } from "constants/async";
import { isNic, isEmail } from "shared/kernel/cast";

import "./styles.scss";
import Select from "components/Select";

type AdminAddEmployeePageProps = {
  addEmployee: Function,
  initializeEmployee: Function,
  status: AsyncStatusType,
  notification: NotificationType,
};

type AdminAddEmployeePageState = {
  form: {
    employeeId: string,
    employeeName: string,
    employeeType: string,
    contactNumber: string,
    address: string,
    nic: string,
    email: string,
    salaryPerMonth: string,
  },
  errors: {
    employeeName: null | string,
    contactNumber: null | string,
    address: null | string,
    nic: null | string,
    email: null | string,
    salaryPerMonth: null | string,
  },
};

class AdminAddEmployeePage extends Component<
  AdminAddEmployeePageProps,
  AdminAddEmployeePageState
> {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        employeeId: "",
        employeeName: "",
        employeeType: "Admin",
        contactNumber: "",
        address: "",
        nic: "",
        email: "",
        salaryPerMonth: "",
      },
      errors: {
        employeeName: null,
        contactNumber: null,
        address: null,
        nic: null,
        email: null,
        salaryPerMonth: null,
      },
    };

    // $FlowFixMe
    this.resetEmployee = this.resetEmployee.bind(this);
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

  componentDidMount() {
    this.props.initializeEmployee();

    let employeeService = serviceManager.get("EmployeeService");

    employeeService.getNewEmployeeCode().then(({ success, employeeId }) => {
      if (success) {
        this.setState(({ form }) => ({
          form: {
            ...form,
            employeeId: employeeId,
          },
        }));
      }
    });
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: {
        employeeName,
        contactNumber,
        address,
        nic,
        email,
        salaryPerMonth,
      },
    } = this.state;

    let hasError = false;

    if (employeeName === "") {
      this.setFormErrors("employeeName", "Employee name is required.");
      hasError = true;
    }

    if (contactNumber === "") {
      this.setFormErrors("contactNumber", "ContactNumber is required.");
      hasError = true;
    } else if (!(contactNumber.length === 9 || contactNumber.length === 10)) {
      this.setFormErrors("contactNumber", "ContactNumber is invalid.");
      hasError = true;
    }

    if (address === "") {
      this.setFormErrors("address", "Address is required.");
      hasError = true;
    }

    if (nic === "") {
      this.setFormErrors("nic", "Nic is required.");
      hasError = true;
    } else if (isNic(nic)) {
      this.setFormErrors("nic", "Nic is not valid.");
      hasError = true;
    }

    if (email === "") {
      this.setFormErrors("email", "Email is required.");
      hasError = true;
    } else if (!isEmail(email)) {
      this.setFormErrors("email", "Email is not valid.");
      hasError = true;
    }

    if (salaryPerMonth === "") {
      this.setFormErrors("salaryPerMonth", "SalaryPerMonth is required.");
      hasError = true;
    } else if (isNaN(salaryPerMonth)) {
      this.setFormErrors("salaryPerMonth", "SalaryPerMonth is invalid.");
      hasError = true;
    }

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        employeeName: null,
        contactNumber: null,
        address: null,
        nic: null,
        email: null,
        salaryPerMonth: null,
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

  resetEmployee() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        employeeName: "",
        employeeType: "Admin",
        contactNumber: "",
        address: "",
        nic: "",
        email: "",
        salaryPerMonth: "",
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
      this.props.addEmployee({ ...form });
    }
  }

  render() {
    const {
      form: {
        employeeId,
        employeeName,
        employeeType,
        contactNumber,
        address,
        nic,
        email,
        salaryPerMonth,
      },
      errors,
    } = this.state;

    const { status, notification } = this.props;

    return (
      <Layout
        breadcrumbs={["Add New Employee"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetEmployee}>
              Reset
            </Button>
            <Button
              type={Button.TYPE.SUCCESS}
              disabled={isEmpty(employeeId)}
              onClick={this.onSubmitForm}
            >
              Save
            </Button>
          </Fragment>
        }
      >
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {status === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="add-employee">
            <div className="add-employee-container">
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Employee Id
                    </Col>
                    <Col sm={12} md={6}>
                      <Input id="employeeId" text={employeeId} disabled />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Employee Name
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="employeeName"
                        text={employeeName}
                        onChange={(employeeName) =>
                          this.onChangeFormField({ employeeName })
                        }
                        error={errors.employeeName}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Employee Type
                    </Col>
                    <Col sm={12} md={6}>
                      <Select
                        id="employeeType"
                        selected={employeeType}
                        options={["Admin", "Store Keeper", "Cashier"]}
                        onChange={(employeeType) =>
                          this.onChangeFormField({ employeeType })
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Contact Number
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="contactNumber"
                        text={contactNumber}
                        onChange={(contactNumber) =>
                          this.onChangeFormField({ contactNumber })
                        }
                        error={errors.contactNumber}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Address
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="address"
                        text={address}
                        onChange={(address) =>
                          this.onChangeFormField({ address })
                        }
                        error={errors.address}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      NIC
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="nic"
                        text={nic}
                        onChange={(nic) => this.onChangeFormField({ nic })}
                        error={errors.nic}
                      />
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
                      <Input
                        id="email"
                        text={email}
                        onChange={(email) => this.onChangeFormField({ email })}
                        error={errors.email}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Salary Per Month
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="salary"
                        text={salaryPerMonth}
                        onChange={(salaryPerMonth) =>
                          this.onChangeFormField({ salaryPerMonth })
                        }
                        error={errors.salaryPerMonth}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
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
  };
}

const Actions = {
  addEmployee,
  initializeEmployee,
};

export default connect(mapStateToProps, Actions)(AdminAddEmployeePage);
