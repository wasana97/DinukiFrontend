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
import Select from "components/Select";
import Alert from "components/Alert";
import Loader from "components/loader";

import { ASYNC_STATUS } from "constants/async";
import { getProducts, notificationHandler, initProduct } from "action/product";
import { filters } from "constants/user";
import { serviceManager } from "services/manager";
import { isNotEmpty } from "shared/utils";
import {
  addCustomerReturn,
  initializeCustomerReturn,
} from "action/customerReturn";

import "./styles.scss";

type CreateReturnPageProps = {
  getProducts: Function,
  initProduct: Function,
  initializeCustomerReturn: Function,
  notificationHandler: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  products: Array<any>,
  addCustomerReturn: Function,
  returnStatus: AsyncStatusType,
  returnNotification: NotificationType,
};

type CreateReturnPageState = {
  customerReturnId: string,
  form: {
    productCode: string,
    productName: string,
    size: string,
    price: string,
    color: string,
    quantity: string,
    returnQty: string,
    reason: string,
    cashierId: string,
  },
  errors: {
    returnQty: null | string,
    cashierId: null | string,
  },
};

class CreateReturnPage extends Component<
  CreateReturnPageProps,
  CreateReturnPageState
> {
  constructor(props) {
    super(props);

    this.state = {
      customerReturnId: "",
      form: {
        productCode: "",
        productName: "",
        size: "",
        price: "",
        color: "",
        quantity: "",
        returnQty: "",
        reason: "",
        cashierId: "",
      },
      errors: {
        returnQty: null,
        cashierId: null,
      },
    };
    // $FlowFixMe
    this.onChangeFormField = this.onChangeFormField.bind(this);
    // $FlowFixMe
    this.onSearchProduct = this.onSearchProduct.bind(this);
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

  componentDidMount() {
    this.props.initializeCustomerReturn();
    let customerReturnService = serviceManager.get("CustomerReturnService");

    customerReturnService
      .getNewCustomerReturnId()
      .then(({ success, returnId }) => {
        if (success) {
          this.setState({
            ...this.state,
            customerReturnId: returnId,
          });
        }
      });

    this.props.getProducts({ ...filters });
  }

  resetProduct() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        productCode: "",
        productName: "",
        size: "",
        price: "",
        color: "",
        quantity: "",
        returnQty: "",
        reason: "",
        cashierId: "",
      },
    }));
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { quantity, returnQty, cashierId },
    } = this.state;

    let hasError = false;

    if (returnQty === "") {
      this.setFormErrors("returnQty", "Quantity is required.");
      hasError = true;
    } else if (/\D/.test(returnQty)) {
      this.setFormErrors("returnQty", "Quantity is invalid.");
      hasError = true;
    } else if (quantity < returnQty) {
      this.setFormErrors("returnQty", "No enough products to return.");
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
        returnQty: null,
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

  onSearchProduct() {
    const {
      form: { productCode },
    } = this.state;
    const { products, initProduct } = this.props;
    this.props.initializeCustomerReturn();
    initProduct();

    const filteredProduct =
      products.length > 0
        ? products.filter(({ productCode: id }) => id === productCode)
        : [];

    const selectedProduct =
      filteredProduct.length > 0
        ? filteredProduct.map(
            ({ productName, size, price, color, quantity }) => {
              return {
                productName,
                size,
                price,
                color,
                quantity,
              };
            }
          )
        : null;

    if (isNotEmpty(selectedProduct)) {
      this.setState(({ form }) => ({
        form: {
          ...form,
          ...selectedProduct[0],
        },
      }));
    } else {
      this.props.notificationHandler(false, "Product not found");
    }
  }

  onSubmitForm() {
    const {
      customerReturnId,
      form: {
        productCode,
        productName,
        size,
        color,
        returnQty,
        reason,
        cashierId,
      },
    } = this.state;

    if (!this.validateForm()) {
      this.props.addCustomerReturn({
        returnId: customerReturnId,
        productCode,
        ProductName: productName,
        size: size.toString(),
        color,
        quantity: returnQty,
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
        productName,
        size,
        price,
        color,
        quantity,
        returnQty,
        reason,
        cashierId,
      },
      errors,
    } = this.state;

    const {
      notification,
      status,
      returnStatus,
      returnNotification,
    } = this.props;

    return (
      <Layout
        breadcrumbs={["Create Stock Return"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetProduct}>
              Reset
            </Button>
            <Button type={Button.TYPE.SUCCESS} onClick={this.onSubmitForm}>
              Create
            </Button>
          </Fragment>
        }
      >
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {returnNotification && (
          <Alert type={returnNotification.type}>
            {returnNotification.message}
          </Alert>
        )}
        {status === ASYNC_STATUS.LOADING || returnStatus === ASYNC_STATUS ? (
          <Loader isLoading />
        ) : (
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
                  <Button
                    className="search-button"
                    onClick={this.onSearchProduct}
                  >
                    Search
                  </Button>
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
                      <Input id="size" text={size} disabled />
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
                      <Input id="quantity" text={quantity} disabled />
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
                        text={returnQty}
                        onChange={(returnQty) =>
                          this.onChangeFormField({ returnQty })
                        }
                        error={errors.returnQty}
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
                        onChange={(reason) =>
                          this.onChangeFormField({ reason })
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
        )}
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.product.status,
    notification: state.product.notification,
    products: state.product.products,
    returnStatus: state.customerReturn.status,
    returnNotification: state.customerReturn.notification,
  };
}

const Actions = {
  getProducts,
  notificationHandler,
  initProduct,
  addCustomerReturn,
  initializeCustomerReturn,
};

export default connect(mapStateToProps, Actions)(CreateReturnPage);
