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

type UpdateProductFormPageProps = {
  updateProduct: Function,
  notification: NotificationType,
  product: object,
};

type UpdateProductFormPageState = {
  form: {
    productCode: string,
    productName: string,
    supplierCode: string,
    size: string,
    price: string,
    color: string,
    quantity: string,
    storeLocation: string,
    margin: string,
  },
  errors: {
    productName: null | string,
    size: null | string,
    price: null | string,
    quantity: null | string,
    storeLocation: null | string,
    supplierCode: null | string,
    color: null | string,
  },
};

class UpdateProductFormPage extends Component<
  UpdateProductFormPageProps,
  UpdateProductFormPageState
> {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        ...this.props.product,
      },
      errors: {
        productName: null,
        size: null,
        price: null,
        quantity: null,
        color: null,
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

  onChangeFormField(value) {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...value,
      },
    }));
  }

  resetProduct() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...this.props.product,
      },
    }));
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { productName, size, price, quantity, color },
    } = this.state;

    let hasError = false;

    if (productName === "") {
      this.setFormErrors("productName", "Product name is required.");
      hasError = true;
    }

    if (size === "") {
      this.setFormErrors("size", "Size is required.");
      hasError = true;
    } else if (/\D/.test(size)) {
      this.setFormErrors("size", "Size is invalid.");
      hasError = true;
    }

    if (color === "") {
      this.setFormErrors("color", "Color is required.");
      hasError = true;
    }

    if (price === "") {
      this.setFormErrors("price", "Price is required.");
      hasError = true;
    } else if (isNaN(price)) {
      this.setFormErrors("price", "Price is invalid.");
      hasError = true;
    }

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
        productName: null,
        size: null,
        price: null,
        quantity: null,
        color: null,
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
      this.props.updateProduct({ ...form });
    }
  }

  render() {
    const { notification } = this.props;
    const {
      form: {
        productCode,
        productName,
        size,
        price,
        quantity,
        storeLocation,
        supplierCode,
        color,
      },
      errors,
    } = this.state;

    return (
      <Layout
        breadcrumbs={["Update Product"]}
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

        <div className="add-product">
          <div className="add-product-container">
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
                    <Input
                      id="productName"
                      text={productName}
                      onChange={(productName) =>
                        this.onChangeFormField({ productName })
                      }
                      error={errors.productName}
                    />
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
                    Size
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      id="size"
                      text={size}
                      onChange={(size) => this.onChangeFormField({ size })}
                      error={errors.size}
                    />
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
                    <Input
                      id="price"
                      text={price}
                      onChange={(price) => this.onChangeFormField({ price })}
                      error={errors.price}
                    />
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
                    <Input
                      id="color"
                      text={color}
                      onChange={(color) => this.onChangeFormField({ color })}
                      error={errors.color}
                    />
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
                    Store Location
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      id="storeLocation"
                      text={storeLocation}
                      onChange={(storeLocation) =>
                        this.onChangeFormField({ storeLocation })
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

export default UpdateProductFormPage;
