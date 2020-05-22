// @flow
import React, { Component, Fragment } from "react";
import { type NotificationType } from "shared/types/General";

import Layout from "components/inventoryLayout";
import Button from "components/button";
import Row from "components/Row";
import Col from "components/Col";
import Input from "components/Input";
import Select from "components/Select";
import Alert from "components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

type UpdateReturnPageFormProps = {
  notification: NotificationType,
  updateCustomerReturn: Function,
  customerReturn: Object,
};

type UpdateReturnPageFormState = {
  form: {
    returnId: string,
    productCode: string,
    ProductName: string,
    size: string,
    price: string,
    color: string,
    quantity: string,
    reason: string,
    cashierId: string,
  },
  errors: {
    quantity: null | string,
    cashierId: null | string,
  },
};

class UpdateReturnPageForm extends Component<
  UpdateReturnPageFormProps,
  UpdateReturnPageFormState
> {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        ...this.props.customerReturn,
      },
      errors: {
        quantity: null,
        cashierId: null,
      },
    };

    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.onChangeFormField = this.onChangeFormField.bind(this);
    // $FlowFixMe
    this.resetProduct = this.resetProduct.bind(this);
    // $FlowFixMe
    this.validateForm = this.validateForm.bind(this);
    // $FlowFixMe
    this.resetFormErrors = this.resetFormErrors.bind(this);
    // $FlowFixMe
    this.setFormErrors = this.setFormErrors.bind(this);
    // $FlowFixMe
    this.onSubmitForm = this.onSubmitForm.bind(this);
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
          onClick: () => {},
        },
      ],
    });
  }

  resetProduct() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...this.props.customerReturn,
      },
    }));
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { quantity, cashierId },
    } = this.state;

    let hasError = false;

    if (quantity === "") {
      this.setFormErrors("returnQty", "Quantity is required.");
      hasError = true;
    } else if (/\D/.test(quantity)) {
      this.setFormErrors("returnQty", "Quantity is invalid.");
      hasError = true;
    }

    if (cashierId === "") {
      this.setFormErrors("cashierId", "CashierId is required.");
      hasError = true;
    }

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        quantity: null,
        cashierId: null,
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

  onChangeFormField(value) {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...value,
      },
    }));
  }

  onSubmitForm() {
    const {
      form: {
        returnId,
        productCode,
        ProductName,
        size,
        color,
        quantity,
        reason,
        cashierId,
      },
    } = this.state;

    if (!this.validateForm()) {
      this.props.updateCustomerReturn({
        returnId,
        productCode,
        ProductName,
        size: size.toString(),
        color,
        quantity,
        reason,
        cashierId,
        date: new Date(),
      });
    }
  }

  render() {
    const {
      form: {
        productCode,
        ProductName,
        size,
        color,
        quantity,
        reason,
        cashierId,
      },
      errors,
    } = this.state;

    const { notification } = this.props;

    return (
      <Layout
        breadcrumbs={["Create Stock Return"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetProduct}>
              Reset
            </Button>
            <Button
              type={Button.TYPE.SUCCESS}
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

        <div className="add-return">
          <div className="add-product-container">
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Product Code
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      id="productCode"
                      text={productCode}
                      onChange={(productCode) =>
                        this.onChangeFormField({ productCode })
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
                    Product Name
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="productName" text={ProductName} disabled />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Size
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="size" text={size} disabled />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Color
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="color" text={color} disabled />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Return Quantity
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      id="returnQty"
                      text={quantity}
                      onChange={(quantity) =>
                        this.onChangeFormField({ quantity })
                      }
                      error={errors.quantity}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Return Reason
                  </Col>
                  <Col sm={12} md={6}>
                    <Select
                      id="reason"
                      placeholder="select"
                      selected={reason}
                      options={["Damaged", "Return"]}
                      onChange={(reason) => this.onChangeFormField({ reason })}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    CashierId
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      id="cashierId"
                      text={cashierId}
                      onChange={(cashierId) =>
                        this.onChangeFormField({ cashierId })
                      }
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

export default UpdateReturnPageForm;
