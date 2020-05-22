// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Loader from "components/loader";
import UpdateReturnPageForm from "./component/updateStockReturnForm";

import { ASYNC_STATUS } from "constants/async";
import { getCustomerReturn, updateCustomerReturn } from "action/customerReturn";

import "./styles.scss";

type UpdateCustomerReturnPageProps = {
  getCustomerReturn: Function,
  updateCustomerReturn: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  customerReturn: Object | null,
  match: {
    params: {
      returnId: number,
    },
  },
};
class UpdateCustomerReturnPage extends Component<UpdateCustomerReturnPageProps> {
  componentDidMount() {
    const {
      match: {
        params: { returnId },
      },
    } = this.props;

    this.props.getCustomerReturn(returnId);
  }

  render() {
    const {
      status,
      notification,
      updateCustomerReturn,
      customerReturn,
      match: {
        params: { returnId },
      },
    } = this.props;

    if (status === ASYNC_STATUS.LOADING) {
      return <Loader isLoading />;
    }

    return (
      <Fragment>
        {customerReturn && customerReturn.returnId === returnId && (
          <UpdateReturnPageForm
            notification={notification}
            updateCustomerReturn={updateCustomerReturn}
            customerReturn={customerReturn}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.customerReturn.status,
    notification: state.customerReturn.notification,
    customerReturn: state.customerReturn.customerReturn,
  };
}

const Actions = {
  getCustomerReturn,
  updateCustomerReturn,
};

export default connect(mapStateToProps, Actions)(UpdateCustomerReturnPage);
