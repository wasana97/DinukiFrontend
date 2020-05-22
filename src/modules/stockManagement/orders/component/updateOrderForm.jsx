// @flow
import React, { Component, Fragment } from "react";
import { type NotificationType } from "shared/types/General";

import Layout from "components/inventoryLayout";
import Button from "components/button";
import Row from "components/Row";
import Col from "components/Col";
import Input from "components/Input";
import Alert from "components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

type UpdateOrderFormPageProps = {
  updateOrders: Function,
  notification: NotificationType,
  order: object,
};

type UpdateOrderFormPageState = {
  form: {
    orderId: string,
    supplierCode: string,
    productCode: string,
    productName: string,
    size: string,
    price: string,
    color: String,
    quantity: string,
  },
  errors: {
    quantity: null | string,
  },
};

class UpdateOrderFormPage extends Component<
  UpdateOrderFormPageProps,
  UpdateOrderFormPageState
> {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        ...this.props.order,
      },
      errors: {
        quantity: null,
      },
    };
    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.onChangeFormField = this.onChangeFormField.bind(this);
    // $FlowFixMe
    this.resetOrder = this.resetOrder.bind(this);
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

  onChangeFormField(value) {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...value,
      },
    }));
  }

  resetOrder() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...this.props.order,
      },
    }));
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { quantity },
    } = this.state;

    let hasError = false;

    if (quantity === "") {
      this.setFormErrors("quantity", "Quantity is required.");
      hasError = true;
    } else if (/\D/.test(quantity)) {
      this.setFormErrors("quantity", "Quantity is invalid.");
      hasError = true;
    }

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        quantity: null,
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

  onSubmitForm() {
    const { form } = this.state;

    if (!this.validateForm()) {
      this.props.updateOrders({ ...form });
    }
  }

  render() {
    const { notification } = this.props;
    const {
      form: {
        orderId,
        supplierCode,
        productCode,
        productName,
        size,
        price,
        color,
        quantity,
      },
      errors,
    } = this.state;

    return (
      <Layout
        breadcrumbs={["Update Order"]}
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
        <div className="add-order">
          <div className="add-order-container">
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Order Id
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="orderId" text={orderId} disabled />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Supplier Code
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="supplierCode" text={supplierCode} disabled />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Product Code
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="productCode" text={productCode} disabled />
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
                    <Input id="productName" text={productName} disabled />
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
                    <Input id="size" type="number" text={size} disabled />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col className="field-label" sm={12} md={6}>
                    Price
                  </Col>
                  <Col sm={12} md={6}>
                    <Input id="price" text={price} disabled />
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
                    Quantity
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      id="quantity"
                      text={quantity}
                      type="number"
                      onChange={(quantity) =>
                        this.onChangeFormField({ quantity })
                      }
                      error={errors.quantity}
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

export default UpdateOrderFormPage;
