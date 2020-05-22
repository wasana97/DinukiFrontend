// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/inventoryLayout";
import Button from "components/button";
import Row from "components/Row";
import Col from "components/Col";
import Input from "components/Input";
import Loader from "components/loader";
import Alert from "components/Alert";

import { addProduct, initializeProduct } from "action/product";
import { getSuppliers } from "action/supplier";
import { serviceManager } from "services/manager";
import { isEmpty } from "shared/utils";
import { ASYNC_STATUS } from "constants/async";
import { filters } from "constants/user";

import "./styles.scss";
import Select from "components/Select";

type AddProductPageProps = {
  addProduct: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  getSuppliers: Function,
  supplierStatus: AsyncStatusType,
  supplierNotification: NotificationType,
  suppliers: Array<any>,
  initializeProduct: Function,
};

type AddProductPageState = {
  form: {
    productCode: string,
    productName: string,
    supplierCode: string,
    size: string,
    price: string,
    color: String,
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

class AddProductPage extends Component<
  AddProductPageProps,
  AddProductPageState
> {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        productCode: "",
        productName: "",
        supplierCode: "",
        size: "",
        price: "",
        color: "",
        quantity: "",
        storeLocation: "",
        margin: "10",
      },
      errors: {
        productName: null,
        size: null,
        price: null,
        quantity: null,
        supplierCode: null,
        color: null,
      },
    };
    // $FlowFixMe
    this.resetProduct = this.resetProduct.bind(this);
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
    this.props.getSuppliers({ ...filters });
    this.props.initializeProduct();
    let productService = serviceManager.get("ProductService");

    productService.getNewProductCode().then(({ success, orderNumber }) => {
      if (success) {
        this.setState(({ form }) => ({
          form: {
            ...form,
            productCode: orderNumber,
          },
        }));
      }
    });
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

  resetProduct() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        productName: "",
        supplierCode: "",
        size: "",
        price: "",
        quantity: "",
        storeLocation: "",
        color: "",
        margin: "100",
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
      this.props.addProduct({ ...form });
    }
  }

  render() {
    const { status, notification, supplierStatus, suppliers } = this.props;
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

    const supplierOptions =
      suppliers.length > 0
        ? [...suppliers.map(({ supplierCode }) => supplierCode)]
        : [];

    return (
      <Layout
        breadcrumbs={["Add New Product"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetProduct}>
              Reset
            </Button>
            <Button
              type={Button.TYPE.SUCCESS}
              disabled={isEmpty(productCode)}
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
        {status === ASYNC_STATUS.LOADING ||
        supplierStatus === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
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
                      <Select
                        id="supplierCode"
                        options={supplierOptions}
                        placeholder="Select"
                        selected={supplierCode}
                        onChange={(supplierCode) =>
                          this.onChangeFormField({ supplierCode })
                        }
                        error={errors.supplierCode}
                      />
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
                        type="number"
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
        )}
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.product.status,
    notification: state.product.notification,
    supplierStatus: state.supplier.status,
    supplierNotification: state.supplier.notification,
    suppliers: state.supplier.suppliers,
  };
}

const Actions = {
  addProduct,
  getSuppliers,
  initializeProduct,
};

export default connect(mapStateToProps, Actions)(AddProductPage);
