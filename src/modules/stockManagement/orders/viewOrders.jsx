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
import { getOrders, deleteOrders } from "action/orders";
import { filters } from "constants/user";

import "./styles.scss";

type AdminViewOrdersPageProps = {
  getOrders: Function,
  deleteOrders: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  orders: Array<any>,
};

class AdminViewOrdersPage extends Component<AdminViewOrdersPageProps> {
  constructor(props) {
    super(props);

    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.deleteOrder = this.deleteOrder.bind(this);
  }

  componentDidMount() {
    this.props.getOrders({ ...filters });
  }

  confirmationMessage(orderNumber) {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to delete this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteOrder(orderNumber);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  deleteOrder(orderNumber) {
    this.props.deleteOrders(orderNumber);
  }

  render() {
    const { status, notification, orders } = this.props;

    return (
      <Layout
        breadcrumbs={["View Orders"]}
        actions={
          <Fragment>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="dataTable"
              filename="Orders Report"
              sheet="orders_report"
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
          <div className="view-orders">
            <div className="table-container">
              <div className="table-section">
                <table id="dataTable">
                  <tbody>
                    <tr className="table-heading">
                      <th>Order Id</th>
                      <th>Supplier Code</th>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Color</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                    {orders.length > 0 &&
                      orders.map((order) => {
                        return (
                          <tr key={order.orderId}>
                            <td>
                              <Link to={`/orders/update/${order.orderId}`}>
                                {order.orderId}
                              </Link>
                            </td>
                            <td>{order.supplierCode}</td>
                            <td>{order.productCode}</td>
                            <td>{order.productName}</td>
                            <td>{order.size}</td>
                            <td>{order.price}</td>
                            <td>{order.color}</td>
                            <td>{order.quantity}</td>
                            <td>
                              <Button
                                type={Button.TYPE.DANGER}
                                onClick={() =>
                                  this.confirmationMessage(order.orderId)
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
    status: state.order.status,
    notification: state.order.notification,
    orders: state.order.orders,
  };
}

const Actions = {
  getOrders,
  deleteOrders,
};

export default connect(mapStateToProps, Actions)(AdminViewOrdersPage);
