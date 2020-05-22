// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType
} from "shared/types/General";

import Layout from "components/inventoryLayout";
import Button from "components/button";
import Row from "components/Row";
import Col from "components/Col";
import Input from "components/Input";
import Alert from "components/Alert";
import Loader from "components/loader";

import { ASYNC_STATUS } from "constants/async";
import {
  getProducts,
  notificationHandler,
  initProduct,
  updateProduct
} from "action/product";
import { filters } from "constants/user";
import { isNotEmpty } from "shared/utils";

import "./styles.scss";

type ProductMarginPageProps = {
  getProducts: Function,
  initProduct: Function,
  notificationHandler: Function,
  updateProduct: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  products: Array<any>
};

type ProductMarginPageState = {
  form: {
    productCode: string,
    productName: string,
    supplierCode: string,
    size: string,
    price: string,
    color: String,
    quantity: string,
    storeLocation: string,
    margin: string
  },
  errors: {
    margin: null | string
  }
};

class ProductMarginPage extends Component<
  ProductMarginPageProps,
  ProductMarginPageState
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
        margin: ""
      },
      errors: {
        margin: null
      }
    };

    // $FlowFixMe
    this.onSearchProduct = this.onSearchProduct.bind(this);
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

  componentDidMount() {
    this.props.getProducts({ ...filters });
  }

  onSearchProduct() {
    const {
      form: { productCode }
    } = this.state;
    const { products, initProduct } = this.props;

    initProduct();

    const filteredProduct =
      products.length > 0
        ? products.filter(({ productCode: id }) => id === productCode)
        : [];

    const selectedProduct =
      filteredProduct.length > 0
        ? filteredProduct.map(
            ({
              productName,
              supplierCode,
              size,
              price,
              color,
              quantity,
              storeLocation,
              margin
            }) => {
              return {
                productName,
                supplierCode,
                size,
                price,
                color,
                quantity,
                storeLocation,
                margin
              };
            }
          )
        : null;

    if (isNotEmpty(selectedProduct)) {
      this.setState(({ form }) => ({
        form: {
          ...form,
          ...selectedProduct[0]
        }
      }));
    } else {
      this.props.notificationHandler(false, "Product not found");
    }
  }

  onChangeFormField(value) {
    this.setState(({ form }) => ({
      form: {
        ...form,
        ...value
      }
    }));
  }

  resetProduct() {
    this.setState(({ form }) => ({
      form: {
        ...form,
        productCode: "",
        productName: "",
        size: "",
        price: "",
        quantity: "",
        storeLocation: "",
        color: "",
        margin: "100"
      }
    }));
  }

  validateForm() {
    this.resetFormErrors();

    const {
      form: { margin }
    } = this.state;

    let hasError = false;

    if (margin === "") {
      this.setFormErrors("margin", "Margin is required.");
      hasError = true;
    }

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        margin: null
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

  onSubmitForm() {
    const { form } = this.state;

    if (!this.validateForm()) {
      this.props.updateProduct({ ...form });
    }
  }

  render() {
    const { status, notification } = this.props;
    const {
      form: { productCode, productName, supplierCode, margin },
      errors
    } = this.state;
    return (
      <Layout
        breadcrumbs={["Product Margin"]}
        actions={
          <Fragment>
            <Button type={Button.TYPE.DANGER} onClick={this.resetProduct}>
              Reset
            </Button>
            <Button type={Button.TYPE.SUCCESS} onClick={this.onSubmitForm}>
              Set Margin
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
          <div className="add-product">
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
                        onChange={productCode =>
                          this.onChangeFormField({ productCode })
                        }
                      />
                      <Button
                        className="search-button"
                        onClick={this.onSearchProduct}
                      >
                        Search
                      </Button>
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
                      Supplier Name
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="supplierCode"
                        text={supplierCode}
                        onChange={supplierCode =>
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
                      Set margin
                    </Col>
                    <Col sm={12} md={6}>
                      <Input
                        id="margin"
                        text={margin}
                        onChange={margin => this.onChangeFormField({ margin })}
                        error={errors.margin}
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
    products: state.product.products
  };
}

const Actions = {
  getProducts,
  notificationHandler,
  initProduct,
  updateProduct
};

export default connect(mapStateToProps, Actions)(ProductMarginPage);
