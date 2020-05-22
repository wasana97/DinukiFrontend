// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/adminLayout";
import Button from "components/button";
import Loader from "components/loader";
import Alert from "components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import { getSuppliers, deleteSupplier } from "action/supplier";
import { ASYNC_STATUS } from "constants/async";
import { filters } from "constants/user";
import { Link } from "react-router-dom";

import "./styles.scss";

type AdminViewSupplierPageProps = {
  getSuppliers: Function,
  deleteSupplier: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  suppliers: Array<any>,
};

type AdminViewSupplierPageState = {
  filters: {
    supplierCode: string,
    supplierName: string,
  },
};
class AdminViewSupplierPage extends Component<
  AdminViewSupplierPageProps,
  AdminViewSupplierPageState
> {
  constructor(props) {
    super(props);

    // $FlowFixMe
    this.confirmationMessage = this.confirmationMessage.bind(this);
    // $FlowFixMe
    this.deleteSupplier = this.deleteSupplier.bind(this);
  }

  componentDidMount() {
    this.props.getSuppliers({ ...filters });
  }

  confirmationMessage(supplierId) {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure to delete this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteSupplier(supplierId);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  deleteSupplier(supplierCode) {
    this.props.deleteSupplier(supplierCode);
  }

  render() {
    const { status, notification, suppliers } = this.props;

    return (
      <Layout
        breadcrumbs={["View Suppliers"]}
        actions={
          <Fragment>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="dataTable"
              filename="Supplier Report"
              sheet="supplier_report"
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
          <div className="view-employee">
            <div className="table-container">
              <div className="table-section">
                <table id="dataTable">
                  <tbody>
                    <tr className="table-heading">
                      <th>Supplier Id</th>
                      <th>Supplier Name</th>
                      <th>Contact Number</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                    {suppliers.length > 0 &&
                      suppliers.map((supplier) => {
                        return (
                          <tr key={supplier.supplierCode}>
                            <td>
                              <Link
                                to={`/admin/supplier/update/${supplier.supplierCode}`}
                              >
                                {supplier.supplierCode}
                              </Link>
                            </td>
                            <td>{supplier.supplierName}</td>
                            <td>{supplier.contactNumber}</td>
                            <td>{supplier.address}</td>
                            <td>
                              <Button
                                type={Button.TYPE.DANGER}
                                onClick={() =>
                                  this.confirmationMessage(
                                    supplier.supplierCode
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
    status: state.supplier.status,
    notification: state.supplier.notification,
    suppliers: state.supplier.suppliers,
  };
}

const Actions = {
  getSuppliers,
  deleteSupplier,
};

export default connect(mapStateToProps, Actions)(AdminViewSupplierPage);
