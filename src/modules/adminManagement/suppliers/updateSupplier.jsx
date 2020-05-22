// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Loader from "components/loader";
import UpdateSupplierForm from "./component/updateSupplierForm";

import { ASYNC_STATUS } from "constants/async";
import { getSupplier, updateSupplier } from "action/supplier";

import "./styles.scss";

type AdminUpdateSupplierPageProps = {
  getSupplier: Function,
  updateSupplier: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  supplier: Object | null,
  match: {
    params: {
      supplierCode: number,
    },
  },
};

class AdminUpdateSupplierPage extends Component<AdminUpdateSupplierPageProps> {
  componentDidMount() {
    const {
      match: {
        params: { supplierCode },
      },
    } = this.props;

    this.props.getSupplier(supplierCode);
  }

  render() {
    const {
      status,
      notification,
      updateSupplier,
      supplier,
      match: {
        params: { supplierCode },
      },
    } = this.props;

    if (status === ASYNC_STATUS.LOADING) {
      return <Loader isLoading />;
    }

    return (
      <Fragment>
        {supplier && supplier.supplierCode === supplierCode && (
          <UpdateSupplierForm
            notification={notification}
            updateSupplier={updateSupplier}
            supplier={supplier}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.supplier.status,
    notification: state.supplier.notification,
    supplier: state.supplier.supplier,
  };
}

const Actions = {
  getSupplier,
  updateSupplier,
};

export default connect(mapStateToProps, Actions)(AdminUpdateSupplierPage);
