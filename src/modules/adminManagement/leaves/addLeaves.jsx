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
import Select from "components/Select";
import Alert from "components/Alert";
import Loader from "components/loader";

import {
  getEmployees,
  notificationHandler,
  initEmployee
} from "action/employee";
import { addLeave } from "action/leave";
import { filters } from "constants/user";
import { isNotEmpty } from "shared/utils";
import { ASYNC_STATUS } from "constants/async";

import "./styles.scss";

type AdminAddLeavesPageProps = {
  getEmployees: Function,
  notificationHandler: Function,
  initEmployee: Function,
  addLeave: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  employees: Array<any>,
  leaveStatus: AsyncStatusType,
  leaveNotification: NotificationType
};

type AdminAddLeavesPageState = {
  form: {
    employeeId: string,
    employeeName: string,
    employeeType: string,
    nic: string,
    leaveType: string,
    reason: string,
    from: string,
    to: string
  },
  errors: {
    reason: null | string,
    from: null | string,
    to: null | string
  }
};

class AdminAddLeavesPage extends Component<
  AdminAddLeavesPageProps,
  AdminAddLeavesPageState
> {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        employeeId: "",
        employeeName: "",
        employeeType: "",
        nic: "",
        leaveType: "Full Day",
        reason: "",
        from: "",
        to: ""
      },
      errors: {
        reason: null,
        from: null,
        to: null
      }
    };
    // $FlowFixMe
    this.onChangeFormField = this.onChangeFormField.bind(this);
    // $FlowFixMe
    this.onSearchEmployee = this.onSearchEmployee.bind(this);
    // $FlowFixMe
    this.resetEmployee = this.resetEmployee.bind(this);
    // $FlowFixMe
    this.validateForm = this.validateForm.bind(this);
    // $FlowFixMe
    this.resetFormErrors = this.resetFormErrors.bind(this);
    // $FlowFixMe
    this.setFormErrors = this.setFormErrors.bind(this);
    // $FlowFixMe
    this.onLeaveSubmit = this.onLeaveSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getEmployees({ ...filters });
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { reason, from, to }
    } = this.state;

    let hasError = false;

    if (reason === "") {
      this.setFormErrors("reason", "Reason name is required.");
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

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        reason: null,
        from: null,
        to: null
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
        nic: "",
        leaveType: "Full Day",
        reason: "",
        from: "",
        to: ""
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
        ? filteredEmployee.map(({ employeeName, employeeType, nic }) => {
            return {
              employeeName,
              employeeType,
              nic
            };
          })
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

  onLeaveSubmit() {
    const {
      form: { employeeId, leaveType, reason, from, to }
    } = this.state;

    if (!this.validateForm()) {
      this.props.addLeave({ employeeId, leaveType, reason, from, to });
    }
  }

  render() {
    const {
      form: {
        employeeId,
        employeeName,
        employeeType,
        nic,
        leaveType,
        reason,
        from,
        to
      },
      errors
    } = this.state;

    const { status, notification, leaveStatus, leaveNotification } = this.props;

    return (
      <Layout
        breadcrumbs={["Add Leaves"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetEmployee}>
              Reset
            </Button>
            <Button type={Button.TYPE.SUCCESS} onClick={this.onLeaveSubmit}>
              Apply Leaves
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
          <div className="add-leave">
            <div className="add-leave-container">
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
                      NIC
                    </Col>
                    <Col sm={12} md={6}>
                      <Input id="nic" text={nic} disabled />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Leave Type
                    </Col>
                    <Col sm={12} md={6}>
                      <Select
                        id="leaveType"
                        options={["Half Day", "Full Day"]}
                        selected={leaveType}
                        onChange={leaveType =>
                          this.onChangeFormField({ leaveType })
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
                      Reason
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="reason"
                        text={reason}
                        onChange={reason => this.onChangeFormField({ reason })}
                        error={errors.reason}
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

const Actions = { getEmployees, notificationHandler, initEmployee, addLeave };

export default connect(mapStateToProps, Actions)(AdminAddLeavesPage);
