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

import { addOrders, initializeOrder } from "action/orders";
import { getSuppliers } from "action/supplier";
import { getProducts } from "action/product";
import { serviceManager } from "services/manager";
import { isEmpty } from "shared/utils";
import { ASYNC_STATUS } from "constants/async";
import { filters } from "constants/user";

import "./styles.scss";
import Select from "components/Select";

type AddOrderPageProps = {
  addOrders: Function,
  initializeOrder: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  getSuppliers: Function,
  supplierStatus: AsyncStatusType,
  supplierNotification: NotificationType,
  getProducts: Function,
  productStatus: AsyncStatusType,
  productNotification: NotificationType,
  suppliers: Array<any>,
  products: Array<any>,
};

type AddOrderPageState = {
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
    supplierCode: null | string,
    productCode: null | string,
    quantity: null | string,
  },
};

class AddOrderPage extends Component<AddOrderPageProps, AddOrderPageState> {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        orderId: "",
        supplierCode: "",
        productCode: "",
        productName: "",
        size: "",
        price: "",
        color: "",
        quantity: "",
      },
      errors: {
        supplierCode: null,
        productCode: null,
        quantity: null,
      },
    };
    // $FlowFixMe
    this.resetOrder = this.resetOrder.bind(this);
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
    // $FlowFixMe
    this.onChangeProductCode = this.onChangeProductCode.bind(this);
  }

  componentDidMount() {
    this.props.getSuppliers({ ...filters });
    this.props.getProducts({ ...filters });
    this.props.initializeOrder();

    let ordersService = serviceManager.get("OrdersService");

    ordersService.getNewOrderId().then(({ success, orderNumber }) => {
      if (success) {
        this.setState(({ form }) => ({
          form: {
            ...form,
            orderId: orderNumber,
          },
        }));
      }
    });
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { supplierCode, productCode, quantity },
    } = this.state;

    let hasError = false;

    if (supplierCode === "") {
      this.setFormErrors("supplierCode", "Supplier name is required.");
      hasError = true;
    }

    if (productCode === "") {
      this.setFormErrors("productCode", "Product is required.");
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
        supplierCode: null,
        productCode: null,
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

  resetOrder() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        supplierCode: "",
        productCode: "",
        productName: "",
        size: "",
        price: "",
        quantity: "",
        color: "",
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

  onChangeProductCode(code) {
    const { products } = this.props;

    const selectedProduct = products.filter(
      ({ productCode }) => productCode === code
    );

    this.setState(({ form }) => ({
      form: {
        ...form,
        productCode: code,
        productName: selectedProduct[0].productName,
        size: selectedProduct[0].size,
        price: selectedProduct[0].price,
        color: selectedProduct[0].color,
      },
    }));
  }

  onSubmitForm() {
    const { form } = this.state;

    if (!this.validateForm()) {
      this.props.addOrders({ ...form });
    }
  }

  render() {
    const {
      status,
      notification,
      supplierStatus,
      suppliers,
      productStatus,
      products,
    } = this.props;

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

    const supplierOptions =
      suppliers.length > 0
        ? [...suppliers.map(({ supplierCode }) => supplierCode)]
        : [];

    const productOptions =
      products.length > 0
        ? [...products.map(({ productCode }) => productCode)]
        : [];

    return (
      <Layout
        breadcrumbs={["Add New Order"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetOrder}>
              Reset
            </Button>
            <Button
              type={Button.TYPE.SUCCESS}
              disabled={isEmpty(orderId)}
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
        supplierStatus === ASYNC_STATUS.LOADING ||
        productStatus === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
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
                      Product Code
                    </Col>
                    <Col sm={12} md={6}>
                      <Select
                        id="productCode"
                        options={productOptions}
                        placeholder="Select"
                        selected={productCode}
                        onChange={(productCode) =>
                          this.onChangeProductCode(productCode)
                        }
                        error={errors.productCode}
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
        )}
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.order.status,
    notification: state.order.notification,
    supplierStatus: state.supplier.status,
    supplierNotification: state.supplier.notification,
    suppliers: state.supplier.suppliers,
    productStatus: state.product.status,
    productNotification: state.product.notification,
    products: state.product.products,
  };
}

const Actions = {
  getProducts,
  getSuppliers,
  addOrders,
  initializeOrder,
};

export default connect(mapStateToProps, Actions)(AddOrderPage);
