// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/mainLayout";
import Tabs from "components/tabs";
import Row from "components/Row";
import Col from "components/Col";
import Input from "components/Input";
import Button from "components/button";
import Alert from "components/Alert";
import Loader from "components/loader";
import uuid from "uuid";
import Icon from "components/icon";
import Select from "components/Select";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import { isNotEmpty, isEmpty } from "shared/utils";
import { ASYNC_STATUS } from "constants/async";
import { getProducts, notificationHandler, initProduct } from "action/product";
import { getEmployees } from "action/employee";
import { addSaleOrder, getSales, deleteSaleOrder } from "action/sale";
import { filters } from "constants/user";
import { serviceManager } from "services/manager";

import "./styles.scss";

type UpdateProductPageProps = {
  getProducts: Function,
  initProduct: Function,
  notificationHandler: Function,
  status: AsyncStatusType,
  addSaleOrder: Function,
  notification: NotificationType,
  products: Array<any>,
  getEmployees: Function,
  employees: Array<any>,
  employeeStatus: AsyncStatusType,
  employeeNotification: NotificationType,
  saleStatus: AsyncStatusType,
  saleNotification: NotificationType,
  getSales: Function,
  deleteSaleOrder: Function,
  sales: Array<any>,
};

type UpdateProductPageState = {
  saleId: String,
  product: {
    productCode: string,
    productName: string,
    size: string,
    price: string,
    color: string,
    quantity: string,
    sellQty: string,
    discount: string,
    lineTotal: string,
  },
  order: {
    netTotal: string,
    cashier: string,
    salesPerson: string,
    customerPayment: string,
    customerBalance: string,
  },
  orderErrors: {
    cashier: null | string,
    salesPerson: null | string,
    customerPayment: null | string,
    customerBalance: null | string,
  },
  purchasedProducts: Array<any>,
  errors: {
    sellQty: null | string,
    lineTotal: null | string,
  },
  viewSales: {
    viewCashierId: string,
    viewSalesPersonId: string,
    viewDate: string,
  },
};
class CashierPage extends Component<
  UpdateProductPageProps,
  UpdateProductPageState
> {
  constructor(props) {
    super(props);

    this.state = {
      saleId: "",
      product: {
        productCode: "",
        productName: "",
        size: "",
        price: "",
        color: "",
        quantity: "",
        sellQty: "",
        discount: "0",
        lineTotal: "",
      },
      purchasedProducts: [],
      errors: {
        sellQty: null,
        lineTotal: null,
      },
      order: {
        netTotal: "",
        cashier: "",
        salesPerson: "",
        customerPayment: "",
        customerBalance: "",
      },
      orderErrors: {
        cashier: null,
        salesPerson: null,
        customerPayment: null,
        customerBalance: null,
      },
      viewSales: {
        viewCashierId: "",
        viewSalesPersonId: "",
        viewDate: "",
      },
    };
    // $FlowFixMe
    this.confirmationDelete = this.confirmationDelete.bind(this);
    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.onChangeFormField = this.onChangeFormField.bind(this);
    // $FlowFixMe
    this.onSearchProduct = this.onSearchProduct.bind(this);
    // $FlowFixMe
    this.calculateLineTotal = this.calculateLineTotal.bind(this);
    // $FlowFixMe
    this.onPurchaseProduct = this.onPurchaseProduct.bind(this);
    // $FlowFixMe
    this.validateForm = this.validateForm.bind(this);
    // $FlowFixMe
    this.resetFormErrors = this.resetFormErrors.bind(this);
    // $FlowFixMe
    this.setFormErrors = this.setFormErrors.bind(this);
    // $FlowFixMe
    this.resetProduct = this.resetProduct.bind(this);
    // $FlowFixMe
    this.onDeleteTableItem = this.onDeleteTableItem.bind(this);
    // $FlowFixMe
    this.calculateNetTotal = this.calculateNetTotal.bind(this);
    // $FlowFixMe
    this.onChangeOrderField = this.onChangeOrderField.bind(this);
    // $FlowFixMe
    this.setCustomerBalance = this.setCustomerBalance.bind(this);
    // $FlowFixMe
    this.onPlaceOrder = this.onPlaceOrder.bind(this);
    // $FlowFixMe
    this.resetAfterSale = this.resetAfterSale.bind(this);
    // $FlowFixMe
    this.onChangeSalesFilterField = this.onChangeSalesFilterField.bind(this);
    // $FlowFixMe
    this.onViewSalesOrders = this.onViewSalesOrders.bind(this);
    // $FlowFixMe
    this.deleteSaleOrder = this.deleteSaleOrder.bind(this);
  }

  componentDidMount() {
    let saleService = serviceManager.get("SaleService");

    saleService.getNewSaleId().then(({ success, orderNumber }) => {
      if (success) {
        this.setState({
          ...this.state,
          saleId: orderNumber,
        });
      }
    });

    this.props.getProducts({ ...filters });
    this.props.getEmployees({ ...filters });
  }

  onSearchProduct() {
    const {
      product: { productCode },
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
      this.setState(({ product }) => ({
        product: {
          ...product,
          ...selectedProduct[0],
        },
      }));
    } else {
      this.props.notificationHandler(false, "Product not found");
    }
  }

  validateForm() {
    this.resetFormErrors();

    const {
      product: { sellQty, lineTotal, quantity },
    } = this.state;

    let hasError = false;

    if (sellQty === "") {
      this.setFormErrors("sellQty", "Quantity is required.");
      hasError = true;
    }

    if (parseFloat(sellQty) > parseFloat(quantity)) {
      this.setFormErrors("sellQty", "No enough inventory.");
      hasError = true;
    }

    if (lineTotal === "") {
      this.setFormErrors("lineTotal", "Calculate line total.");
      hasError = true;
    }

    return hasError;
  }

  resetFormErrors() {
    this.setState({
      ...this.state,
      errors: {
        sellQty: null,
        lineTotal: null,
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
    this.setState(({ product }) => ({
      product: {
        ...product,
        ...value,
      },
    }));
  }

  onChangeOrderField(value) {
    this.setState(({ order }) => ({
      order: {
        ...order,
        ...value,
      },
    }));
  }

  calculateLineTotal() {
    const {
      product: { price, sellQty, discount },
    } = this.state;

    if (isNotEmpty(sellQty)) {
      let total =
        (parseFloat(price) *
          parseFloat(sellQty) *
          (100 - parseFloat(discount))) /
        100.0;

      this.setState(({ product }) => ({
        product: {
          ...product,
          lineTotal: total,
        },
      }));
    }
  }

  resetProduct() {
    this.setState(({ product }) => ({
      product: {
        ...product,
        productCode: "",
        productName: "",
        size: "",
        price: "",
        color: "",
        quantity: "",
        sellQty: "",
        discount: "0",
        lineTotal: "",
      },
    }));
  }

  onPurchaseProduct() {
    const { product, purchasedProducts } = this.state;
    if (!this.validateForm()) {
      const updatedProducts =
        purchasedProducts.length > 0
          ? [
              ...purchasedProducts.map((item) => item),
              { id: uuid.v4(), ...product },
            ]
          : [{ id: uuid.v4(), ...product }];

      this.setState(
        {
          ...this.state,
          purchasedProducts: updatedProducts,
        },
        this.calculateNetTotal
      );
      this.resetProduct();
    }
  }

  confirmationMessage(productId) {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to delete this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.onDeleteTableItem(productId);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  onDeleteTableItem(productId) {
    const { purchasedProducts } = this.state;

    const updatedProducts = purchasedProducts.filter(
      ({ id }) => id !== productId
    );

    this.setState(
      {
        ...this.state,
        purchasedProducts: updatedProducts,
      },
      this.calculateNetTotal
    );
  }

  calculateNetTotal() {
    const { purchasedProducts } = this.state;

    let total = 0;

    purchasedProducts.length > 0 &&
      purchasedProducts.map(({ lineTotal }) => {
        total += parseFloat(lineTotal);
        return null;
      });

    this.setState(({ order }) => ({
      order: {
        ...order,
        netTotal: parseFloat(total).toFixed(2),
      },
    }));
  }

  setCustomerBalance() {
    const {
      order: { customerPayment, netTotal },
    } = this.state;

    this.setState(({ order }) => ({
      order: {
        ...order,
        customerBalance: (
          parseFloat(netTotal) - parseFloat(customerPayment)
        ).toFixed(2),
      },
    }));
  }

  onPlaceOrder() {
    const {
      saleId,
      order: { netTotal, cashier, salesPerson },
      purchasedProducts,
    } = this.state;

    this.props.addSaleOrder({
      saleId,
      date: new Date(),
      time: new Date(),
      total: netTotal,
      cashierId: cashier,
      salesPersonId: salesPerson,
      products: purchasedProducts,
    });

    this.resetAfterSale();
  }

  confirmationDelete(saleId) {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to delete this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteSaleOrder(saleId);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  deleteSaleOrder(saleId) {
    const {
      viewSales: { viewCashierId, viewSalesPersonId, viewDate },
    } = this.state;

    const viewSales = {
      cashierId: viewCashierId,
      salesPersonId: viewSalesPersonId,
      date: viewDate,
    };

    let filteredQuery = {};

    for (let key in viewSales) {
      if (isNotEmpty(viewSales[key])) {
        filteredQuery[key] = viewSales[key];
      }
    }

    this.props.deleteSaleOrder(saleId, { ...filters, ...filteredQuery });
  }

  onChangeSalesFilterField(field) {
    this.setState(({ viewSales }) => ({
      viewSales: {
        ...viewSales,
        ...field,
      },
    }));
  }

  resetAfterSale() {
    let saleService = serviceManager.get("SaleService");

    saleService.getNewSaleId().then(({ success, orderNumber }) => {
      if (success) {
        this.setState({
          ...this.state,
          saleId: orderNumber,
          product: {
            productCode: "",
            productName: "",
            size: "",
            price: "",
            color: "",
            quantity: "",
            sellQty: "",
            discount: "0",
            lineTotal: "",
          },
          purchasedProducts: [],
          errors: {
            sellQty: null,
            lineTotal: null,
          },
          order: {
            netTotal: "",
            cashier: "",
            salesPerson: "",
            customerPayment: "",
            customerBalance: "",
          },
          orderErrors: {
            cashier: null,
            salesPerson: null,
            customerPayment: null,
            customerBalance: null,
          },
        });
      }
    });
  }

  onViewSalesOrders() {
    const {
      viewSales: { viewCashierId, viewSalesPersonId, viewDate },
    } = this.state;

    const viewSales = {
      cashierId: viewCashierId,
      salesPersonId: viewSalesPersonId,
      date: viewDate,
    };

    let filteredQuery = {};

    for (let key in viewSales) {
      if (isNotEmpty(viewSales[key])) {
        filteredQuery[key] = viewSales[key];
      }
    }

    this.props.getSales({ ...filters, ...filteredQuery });
  }

  render() {
    const {
      saleId,
      product: {
        productCode,
        productName,
        size,
        price,
        color,
        sellQty,
        discount,
        lineTotal,
      },
      purchasedProducts,
      order: {
        netTotal,
        cashier,
        salesPerson,
        customerBalance,
        customerPayment,
      },
      orderErrors,
      viewSales: { viewCashierId, viewSalesPersonId, viewDate },
    } = this.state;

    const {
      status,
      notification,
      employeeStatus,
      employees,
      saleStatus,
      saleNotification,
      sales,
    } = this.props;

    const employeeOptions = [...employees.map(({ employeeId }) => employeeId)];

    return (
      <Layout>
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {saleNotification && (
          <Alert type={saleNotification.type}>{saleNotification.message}</Alert>
        )}
        {status === ASYNC_STATUS.LOADING ||
        employeeStatus === ASYNC_STATUS.LOADING ||
        saleStatus === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="main-page">
            <Tabs
              items={[
                {
                  title: "Cashier",
                  content: (
                    <div className="cashier-page">
                      <Row>
                        <Col size="4">
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
                              <Row>
                                <Col>
                                  <Button onClick={this.onSearchProduct}>
                                    Search
                                  </Button>
                                </Col>
                              </Row>
                              <Row>
                                <Col className="field-label" sm={12} md={6}>
                                  Product Name
                                </Col>
                                <Col sm={12} md={6}>
                                  <Input
                                    id="productName"
                                    text={productName}
                                    disabled
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col className="field-label" sm={12} md={6}>
                                  Size
                                </Col>
                                <Col sm={12} md={6}>
                                  <Input id="size" text={size} disabled />
                                </Col>
                              </Row>
                              <Row>
                                <Col className="field-label" sm={12} md={6}>
                                  Color
                                </Col>
                                <Col sm={12} md={6}>
                                  <Input id="color" text={color} disabled />
                                </Col>
                              </Row>
                              <Row>
                                <Col className="field-label" sm={12} md={6}>
                                  Unit Price
                                </Col>
                                <Col sm={12} md={6}>
                                  <Input id="price" text={price} disabled />
                                </Col>
                              </Row>
                              <Row>
                                <Col className="field-label" sm={12} md={6}>
                                  Quantity
                                </Col>
                                <Col sm={12} md={6}>
                                  <Input
                                    id="sellQty"
                                    type="number"
                                    text={sellQty}
                                    onChange={(sellQty) =>
                                      this.onChangeFormField({ sellQty })
                                    }
                                    onBlur={this.calculateLineTotal}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col className="field-label" sm={12} md={6}>
                                  Discount
                                </Col>
                                <Col sm={12} md={6}>
                                  <Input
                                    id="discount"
                                    type="number"
                                    text={discount}
                                    onChange={(discount) =>
                                      this.onChangeFormField({ discount })
                                    }
                                    onBlur={this.calculateLineTotal}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col className="field-label" sm={12} md={6}>
                                  Line Total
                                </Col>
                                <Col sm={12} md={6}>
                                  <Input
                                    id="lineTotal"
                                    text={lineTotal}
                                    disabled
                                  />
                                </Col>
                              </Row>
                              <Row className="button-container">
                                <Col>
                                  <Button onClick={this.resetProduct}>
                                    Reset
                                  </Button>
                                </Col>
                                <Col>
                                  <Button onClick={this.onPurchaseProduct}>
                                    Add
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <div className="table-container">
                            <div className="table-section">
                              <table>
                                <tbody>
                                  <tr className="table-heading">
                                    <th>Product Code</th>
                                    <th>Product Name</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th>Discount</th>
                                    <th>Line Total</th>
                                    <th>Action</th>
                                  </tr>
                                  {purchasedProducts.length > 0 &&
                                    purchasedProducts.map((product) => {
                                      return (
                                        <tr key={product.id}>
                                          <td>{product.productCode}</td>
                                          <td>{product.productName}</td>
                                          <td>{product.price}</td>
                                          <td>{product.sellQty}</td>
                                          <td>{product.discount}</td>
                                          <td>{product.lineTotal}</td>
                                          <td>
                                            <Button
                                              type={Button.TYPE.DANGER}
                                              onClick={() =>
                                                this.confirmationMessage(
                                                  product.id
                                                )
                                              }
                                            >
                                              <Icon icon="bin" />
                                            </Button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="label-container">
                            <Row>
                              <Col className="field-label" sm={12} md={6}>
                                Net Total
                              </Col>
                              <Col sm={12} md={6}>
                                <Input id="netTotal" text={netTotal} disabled />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="field-label" sm={12} md={6}>
                                Cashier
                              </Col>
                              <Col sm={12} md={6}>
                                <Select
                                  id="cashierId"
                                  options={employeeOptions}
                                  placeholder="select"
                                  selected={cashier}
                                  onChange={(cashier) =>
                                    this.onChangeOrderField({ cashier })
                                  }
                                  error={orderErrors.cashier}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="field-label" sm={12} md={6}>
                                Sales Person
                              </Col>
                              <Col sm={12} md={6}>
                                <Select
                                  id="salesPersonId"
                                  options={employeeOptions}
                                  placeholder="select"
                                  selected={salesPerson}
                                  onChange={(salesPerson) =>
                                    this.onChangeOrderField({ salesPerson })
                                  }
                                  error={orderErrors.salesPerson}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="field-label" sm={12} md={6}>
                                Customer Payment
                              </Col>
                              <Col sm={12} md={6}>
                                <Input
                                  id="customerPayment"
                                  type="number"
                                  text={customerPayment}
                                  onChange={(customerPayment) =>
                                    this.onChangeOrderField({ customerPayment })
                                  }
                                  error={orderErrors.customerPayment}
                                  onBlur={this.setCustomerBalance}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="field-label" sm={12} md={6}>
                                Customer Balance
                              </Col>
                              <Col sm={12} md={6}>
                                <Input
                                  id="customerBalance"
                                  text={customerBalance}
                                />
                              </Col>
                            </Row>
                          </div>
                          <div className="sales-button">
                            <Button
                              type={Button.TYPE.SUCCESS}
                              disabled={isEmpty(saleId)}
                              onClick={this.onPlaceOrder}
                            >
                              Finalize Order
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  title: "My Sales",
                  content: (
                    <div className="view-sales-page">
                      <div className="filter-container">
                        <Row>
                          <Col>
                            <Row>
                              <Col className="field-label" sm={12} md={6}>
                                Cashier Id
                              </Col>
                              <Col sm={12} md={6}>
                                <Select
                                  id="viewCashierId"
                                  options={employeeOptions}
                                  placeholder="select"
                                  selected={viewCashierId}
                                  onChange={(viewCashierId) =>
                                    this.onChangeSalesFilterField({
                                      viewCashierId,
                                    })
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col className="field-label" sm={12} md={6}>
                                Date
                              </Col>
                              <Col sm={12} md={6}>
                                <Input
                                  id="viewSaleDate"
                                  type="date"
                                  text={viewDate}
                                  onChange={(viewDate) =>
                                    this.onChangeSalesFilterField({ viewDate })
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <Row>
                              <Col className="field-label" sm={12} md={6}>
                                SalesPerson Id
                              </Col>
                              <Col sm={12} md={6}>
                                <Select
                                  id="viewSalesPerson"
                                  options={employeeOptions}
                                  placeholder="select"
                                  selected={viewSalesPersonId}
                                  onChange={(viewSalesPersonId) =>
                                    this.onChangeSalesFilterField({
                                      viewSalesPersonId,
                                    })
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <Button onClick={this.onViewSalesOrders}>
                              Search
                            </Button>
                            {sales.length > 0 && (
                              <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button"
                                table="dataTable"
                                filename="Sales Report"
                                sheet="sales_report"
                                buttonText="Generate Report"
                              />
                            )}
                          </Col>
                        </Row>
                      </div>
                      <div className="table-container">
                        <div className="table-section">
                          <table id="dataTable">
                            <tbody>
                              <tr className="table-heading">
                                <th>Sale Id</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Cashier</th>
                                <th>Sales Person</th>
                                <th>Action</th>
                              </tr>
                              {sales.length > 0 &&
                                sales.map((sale) => {
                                  return (
                                    <tr key={sale.saleId}>
                                      <td>{sale.saleId}</td>
                                      <td>{sale.date}</td>
                                      <td>{sale.total}</td>
                                      <td>{sale.cashierId}</td>
                                      <td>{sale.salesPersonId}</td>
                                      <td>
                                        <Button
                                          type={Button.TYPE.DANGER}
                                          onClick={() =>
                                            this.confirmationDelete(sale.saleId)
                                          }
                                        >
                                          Delete
                                        </Button>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
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
    employeeStatus: state.employee.status,
    employeeNotification: state.employee.notification,
    employees: state.employee.employees,
    saleStatus: state.sale.status,
    saleNotification: state.sale.notification,
    sales: state.sale.sales,
  };
}

const Actions = {
  getProducts,
  notificationHandler,
  initProduct,
  getEmployees,
  addSaleOrder,
  getSales,
  deleteSaleOrder,
};

export default connect(mapStateToProps, Actions)(CashierPage);
