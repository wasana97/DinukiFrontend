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
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import {
  getCustomerReturns,
  deleteCustomerReturn,
} from "action/customerReturn";
import { ASYNC_STATUS } from "constants/async";
import { filters } from "constants/user";

import "./styles.scss";
import { Link } from "react-router-dom";

type ViewStockReturnsPageProps = {
  getCustomerReturns: Function,
  deleteCustomerReturn: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  customerReturns: Array<any>,
};

type ViewStockReturnsPageState = {
  filters: {
    returnId: string,
    date: string,
  },
};

class ViewStockReturnsPage extends Component<
  ViewStockReturnsPageProps,
  ViewStockReturnsPageState
> {
  constructor(props) {
    super(props);

    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.resetReturnFilter = this.resetReturnFilter.bind(this);
    // $FlowFixMe
    this.deleteCustomerReturn = this.deleteCustomerReturn.bind(this);
  }

  componentDidMount() {
    this.props.getCustomerReturns({ ...filters });
  }

  resetReturnFilter() {
    this.setState(({ filters }) => ({
      filters: {
        ...filters,
        returnId: "",
        date: "",
      },
    }));
  }

  confirmationMessage(returnId) {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to delete this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteCustomerReturn(returnId);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  deleteCustomerReturn(returnId) {
    this.props.deleteCustomerReturn(returnId, { ...filters });
  }

  render() {
    const { status, notification, customerReturns } = this.props;

    return (
      <Layout
        breadcrumbs={["View Returns"]}
        actions={
          <Fragment>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="dataTable"
              filename="Stock Return Report"
              sheet="stock_return_report"
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
          <div className="view-returns">
            <div className="table-container">
              <div className="table-section">
                <table id="dataTable">
                  <tbody>
                    <tr className="table-heading">
                      <th>Return Id</th>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Date</th>
                      <th>Return Qty</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                    {customerReturns.length > 0 &&
                      customerReturns.map((customerReturn) => {
                        return (
                          <tr key={customerReturn.returnId}>
                            <td>
                              <Link
                                to={`/return/update/${customerReturn.returnId}`}
                              >
                                {customerReturn.returnId}
                              </Link>
                            </td>
                            <td>{customerReturn.productCode}</td>
                            <td>{customerReturn.ProductName}</td>
                            <td>{customerReturn.color}</td>
                            <td>{customerReturn.size}</td>
                            <td>{customerReturn.date}</td>
                            <td>{customerReturn.quantity}</td>
                            <td>{customerReturn.reason}</td>
                            <td>
                              <Button
                                type={Button.TYPE.DANGER}
                                onClick={() =>
                                  this.confirmationMessage(
                                    customerReturn.returnId
                                  )
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
    status: state.customerReturn.status,
    notification: state.customerReturn.notification,
    customerReturns: state.customerReturn.customerReturns,
  };
}

const Actions = {
  getCustomerReturns,
  deleteCustomerReturn,
};

export default connect(mapStateToProps, Actions)(ViewStockReturnsPage);
