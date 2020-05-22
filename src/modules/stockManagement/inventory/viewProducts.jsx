// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/inventoryLayout";
import Button from "components/button";
import Loader from "components/loader";
import Alert from "components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import { Link } from "react-router-dom";
import { ASYNC_STATUS } from "constants/async";
import { getProducts, deleteProduct } from "action/product";
import { filters } from "constants/user";

import "./styles.scss";

type AdminViewProductPageProps = {
  getProducts: Function,
  deleteProduct: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  products: Array<any>,
};

type AdminViewProductPageState = {
  filters: {
    supplier: string,
    size: string,
    color: string,
    storeLocation: string,
  },
};

class AdminViewProductPage extends Component<
  AdminViewProductPageProps,
  AdminViewProductPageState
> {
  constructor(props) {
    super(props);

    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.resetProductFilter = this.resetProductFilter.bind(this);
    // $FlowFixMe
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    this.props.getProducts({ ...filters });
  }

  confirmationMessage(orderNumber) {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to delete this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteProduct(orderNumber);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  resetProductFilter() {
    this.setState(({ filters }) => ({
      filters: {
        ...filters,
        supplier: "",
        size: "",
        color: "",
        storeLocation: "",
      },
    }));
  }

  deleteProduct(productCode) {
    this.props.deleteProduct(productCode);
  }

  render() {
    const { status, notification, products } = this.props;

    return (
      <Layout
        breadcrumbs={["View Products"]}
        actions={
          <Fragment>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="dataTable"
              filename="Product Report"
              sheet="product_report"
              buttonText="Generate Report"
            />
          </Fragment>
        }
      >
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {status === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="view-product">
            <div className="table-container">
              <div className="table-section">
                <table id="dataTable">
                  <tbody>
                    <tr className="table-heading">
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Supplier Code</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Color</th>
                      <th>Margin</th>
                      <th>Quantity</th>
                      <th>Store Location</th>
                      <th>Action</th>
                    </tr>
                    {products.length > 0 &&
                      products.map((product) => {
                        return (
                          <tr
                            key={product.productCode}
                            className={`${
                              product.margin > product.quantity ? "low" : "high"
                            }`}
                          >
                            <td>
                              <Link
                                to={`/product/update/${product.productCode}`}
                              >
                                {product.productCode}
                              </Link>
                            </td>
                            <td>{product.productName}</td>
                            <td>{product.supplierCode}</td>
                            <td>{product.size}</td>
                            <td>{product.price}</td>
                            <td>{product.color}</td>
                            <td>{product.margin}</td>
                            <td>{product.quantity}</td>
                            <td>{product.storeLocation}</td>
                            <td>
                              <Button
                                htmlType={Button.HTML_TYPE.LINK}
                                link={"/orders/create"}
                              >
                                Refill
                              </Button>
                              <Button
                                type={Button.TYPE.DANGER}
                                onClick={() =>
                                  this.confirmationMessage(product.productCode)
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
  };
}

const Actions = {
  getProducts,
  deleteProduct,
};

export default connect(mapStateToProps, Actions)(AdminViewProductPage);
