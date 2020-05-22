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

import { addSupplier } from "action/supplier";
import { serviceManager } from "services/manager";
import { isEmpty } from "shared/utils";
import { ASYNC_STATUS } from "constants/async";

import "./styles.scss";
import Alert from "components/Alert";
import Loader from "components/loader";

type AdminAddSuppliersPageProps = {
  addSupplier: Function,
  status: AsyncStatusType,
  notification: NotificationType,
};

type AdminAddSuppliersPageState = {
  form: {
    supplierCode: string,
    supplierName: string,
    contactNumber: string,
    address: string,
  },
  errors: {
    supplierName: null | string,
    contactNumber: null | string,
    address: null | string,
  },
};

class AdminAddSuppliersPage extends Component<
  AdminAddSuppliersPageProps,
  AdminAddSuppliersPageState
> {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        supplierCode: "",
        supplierName: "",
        contactNumber: "",
        address: "",
      },
      errors: {
        supplierName: null,
        contactNumber: null,
        address: null,
      },
    };

    // $FlowFixMe
    this.resetSupplier = this.resetSupplier.bind(this);
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
    let supplierService = serviceManager.get("SupplierService");

    supplierService.getNewSupplierCode().then(({ success, orderNumber }) => {
      if (success) {
        this.setState(({ form }) => ({
          form: {
            ...form,
            supplierCode: orderNumber,
          },
        }));
      }
    });
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { supplierName, contactNumber, address },
    } = this.state;

    let hasError = false;

    if (supplierName === "") {
      this.setFormErrors("supplierName", "Supplier name is required.");
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

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        supplierName: null,
        contactNumber: null,
        address: null,
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

  resetSupplier() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        supplierName: "",
        contactNumber: "",
        address: "",
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
      this.props.addSupplier({ ...form });
    }
  }

  render() {
    const {
      form: { supplierCode, supplierName, contactNumber, address },
      errors,
    } = this.state;

    const { status, notification } = this.props;

    return (
      <Layout
        breadcrumbs={["Add New Supplier"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetSupplier}>
              Reset
            </Button>
            <Button
              type={Button.TYPE.SUCCESS}
              disabled={isEmpty(supplierCode)}
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
          <div className="add-supplier">
            <div className="add-supplier-container">
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Supplier Id
                    </Col>
                    <Col sm={12} md={6}>
                      <Input id="productCode" text={supplierCode} disabled />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="field-label" sm={12} md={6}>
                      Supplier Name
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="supplierName"
                        text={supplierName}
                        onChange={(supplierName) =>
                          this.onChangeFormField({ supplierName })
                        }
                        error={errors.supplierName}
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
            </div>
          </div>
        )}
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.supplier.status,
    notification: state.supplier.notification,
  };
}

const Actions = {
  addSupplier,
};

export default connect(mapStateToProps, Actions)(AdminAddSuppliersPage);
