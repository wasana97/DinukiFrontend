// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType
} from "shared/types/General";

import Layout from "components/adminLayout";
import Button from "components/button";
import Row from "components/Row";
import Col from "components/Col";
import Input from "components/Input";
import Alert from "components/Alert";
import Loader from "components/loader";

import {
  getEmployees,
  notificationHandler,
  initEmployee
} from "action/employee";
import { onSalaryPayment } from "action/leave";
import { ASYNC_STATUS } from "constants/async";
import { filters } from "constants/user";
import { isNotEmpty } from "shared/utils";

import "./styles.scss";

type AdminSalaryPaymentPageProps = {
  getEmployees: Function,
  notificationHandler: Function,
  initEmployee: Function,
  onSalaryPayment: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  employees: Array<any>,
  leaveStatus: AsyncStatusType,
  leaveNotification: NotificationType
};

type AdminSalaryPaymentPageState = {
  form: {
    employeeId: string,
    employeeName: string,
    employeeType: string,
    salaryPerMonth: string,
    bonus: string,
    from: string,
    to: string,
    netSalary: string
  },
  errors: {
    bonus: null | string,
    from: null | string,
    to: null | string,
    netSalary: null | string
  }
};

class AdminSalaryPaymentPage extends Component<
  AdminSalaryPaymentPageProps,
  AdminSalaryPaymentPageState
  > {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        employeeId: "",
        employeeName: "",
        employeeType: "",
        salaryPerMonth: "",
        bonus: "",
        from: "",
        to: "",
        netSalary: ""
      },
      errors: {
        bonus: null,
        from: null,
        to: null,
        netSalary: null
      }
    };

    // $FlowFixMe
    this.validateForm = this.validateForm.bind(this);
    // $FlowFixMe
    this.resetFormErrors = this.resetFormErrors.bind(this);
    // $FlowFixMe
    this.setFormErrors = this.setFormErrors.bind(this);
    // $FlowFixMe
    this.resetEmployee = this.resetEmployee.bind(this);
    // $FlowFixMe
    this.onSearchEmployee = this.onSearchEmployee.bind(this);
    // $FlowFixMe
    this.onChangeFormField = this.onChangeFormField.bind(this);
    // $FlowFixMe
    this.calculateNetSalary = this.calculateNetSalary.bind(this);
    // $FlowFixMe
    this.onSalaryPayment = this.onSalaryPayment.bind(this);
  }

  componentDidMount() {
    this.props.getEmployees({ ...filters });
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { bonus, from, to, netSalary }
    } = this.state;

    let hasError = false;

    if (bonus === "") {
      this.setFormErrors("bonus", "Bonus name is required.");
      hasError = true;
    }

    if (from === "") {
      this.setFormErrors("from", "Select starting date.");
      hasError = true;
    }

    if (to === "") {
      this.setFormErrors("to", "Select ending date.");
      hasError = true;
    }

    if (netSalary === "") {
      this.setFormErrors("netSalary", "NetSalary is required.");
      hasError = true;
    }

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        bonus: null,
        from: null,
        to: null,
        netSalary: null
      }
    });
  }

  setFormErrors(field: string, message: string) {
    this.setState(({ errors }) => {
      return {
        errors: {
          ...errors,
          [field]: message
        }
      };
    });
  }

  resetEmployee() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        employeeId: "",
        employeeName: "",
        employeeType: "",
        salaryPerMonth: "",
        bonus: "",
        from: "",
        to: "",
        netSalary: ""
      }
    }));
  }

  onChangeFormField(value) {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...value
      }
    }));
  }

  onSearchEmployee() {
    const {
      form: { employeeId }
    } = this.state;
    const { employees, initEmployee } = this.props;

    initEmployee();

    const filteredEmployee =
      employees.length > 0
        ? employees.filter(({ employeeId: id }) => id === employeeId)
        : [];

    const selectedEmployee =
      filteredEmployee.length > 0
        ? filteredEmployee.map(
          ({ employeeName, employeeType, salaryPerMonth }) => {
            return {
              employeeName,
              employeeType,
              salaryPerMonth
            };
          }
        )
        : null;

    if (isNotEmpty(selectedEmployee)) {
      this.setState(({ form }) => ({
        form: {
          ...form,
          ...selectedEmployee[0]
        }
      }));
    } else {
      this.props.notificationHandler(false, "Employee not found");
    }
  }

  calculateNetSalary() {
    const {
      form: { salaryPerMonth, bonus }
    } = this.state;

    let netSalary = parseFloat(salaryPerMonth) + parseFloat(bonus);

    this.setState(({ form }) => ({
      form: {
        ...form,
        netSalary: netSalary.toString()
      }
    }));
  }

  onSalaryPayment() {
    const {
      form: {
        employeeId,
        employeeName,
        employeeType,
        salaryPerMonth,
        bonus,
        from,
        to,
        netSalary
      }
    } = this.state;

    if (!this.validateForm()) {
      this.props.onSalaryPayment({
        employeeId,
        employeeName,
        employeeType,
        basicSalary: salaryPerMonth,
        bonus,
        from,
        to,
        netSalary
      });
    }
  }

  render() {
    const {
      form: {
        employeeId,
        employeeName,
        employeeType,
        salaryPerMonth,
        bonus,
        from,
        to,
        netSalary
      },
      errors
    } = this.state;

    const { status, notification, leaveNotification, leaveStatus } = this.props;

    return (
      <Layout
        breadcrumbs={["Add Salary"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetEmployee}>
              Reset
            </Button>
            <Button type={Button.TYPE.SUCCESS} onClick={this.onSalaryPayment}>
              Pay Salary
            </Button>
          </Fragment>
        }
      >
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {leaveNotification && (
          <Alert type={leaveNotification.type}>
            {leaveNotification.message}
          </Alert>
        )}
        {status === ASYNC_STATUS.LOADING ||
          leaveStatus === ASYNC_STATUS.LOADING ? (
            <Loader isLoading />
          ) : (
            <div className="pay-salary">
              <div className="pay-salary-container">
                <Row>
                  <Col>
                    <Row>
                      <Col className="field-label" sm={12} md={6}>
                        Employee Id
                    </Col>
                      <Col sm={12} md={6}>
                        <Input
                          id="employeeId"
                          text={employeeId}
                          onChange={employeeId =>
                            this.onChangeFormField({ employeeId })
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button onClick={this.onSearchEmployee}>Search</Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col className="field-label" sm={12} md={6}>
                        Employee Name
                    </Col>
                      <Col sm={12} md={6}>
                        <Input id="employeeName" text={employeeName} disabled />
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
                        <Input id="employeeType" text={employeeType} disabled />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col className="field-label" sm={12} md={6}>
                        Basic Salary
                    </Col>
                      <Col sm={12} md={6}>
                        <Input
                          id="salaryPerMonth"
                          text={salaryPerMonth}
                          disabled
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col className="field-label" sm={12} md={6}>
                        Bonus
                    </Col>
                      <Col sm={12} md={6}>
                        <Input
                          id="bonus"
                          text={bonus}
                          onChange={bonus => this.onChangeFormField({ bonus })}
                          error={errors.bonus}
                          onBlur={this.calculateNetSalary}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col className="field-label" sm={12} md={6}>
                        From
                    </Col>
                      <Col sm={12} md={6}>
                        <Input
                          id="from"
                          type="date"
                          text={from}
                          onChange={from => this.onChangeFormField({ from })}
                          error={errors.from}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col className="field-label" sm={12} md={6}>
                        To
                    </Col>
                      <Col sm={12} md={6}>
                        <Input
                          id="to"
                          type="date"
                          text={to}
                          onChange={to => this.onChangeFormField({ to })}
                          error={errors.to}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col className="field-label" sm={12} md={6}>
                        Net Salary
                    </Col>
                      <Col sm={12} md={6}>
                        <Input id="netSalary" text={netSalary} disabled />
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
    employees: state.employee.employees,
    leaveStatus: state.leave.status,
    leaveNotification: state.leave.notification
  };
}

const Actions = {
  getEmployees,
  notificationHandler,
  initEmployee,
  onSalaryPayment
};

export default connect(mapStateToProps, Actions)(AdminSalaryPaymentPage);
