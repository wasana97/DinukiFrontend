// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Loader from "components/loader";
import UpdateOrderForm from "./component/updateOrderForm";

import { ASYNC_STATUS } from "constants/async";
import { getOrder, updateOrders } from "action/orders";

import "./styles.scss";

type UpdateOrderPageProps = {
  getOrder: Function,
  updateOrders: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  order: Object | null,
  match: {
    params: {
      orderId: number,
    },
  },
};

class UpdateOrderPage extends Component<UpdateOrderPageProps> {
  componentDidMount() {
    const {
      match: {
        params: { orderId },
      },
    } = this.props;

    this.props.getOrder(orderId);
  }

  render() {
    const {
      status,
      notification,
      updateOrders,
      order,
      match: {
        params: { orderId },
      },
    } = this.props;

    if (status === ASYNC_STATUS.LOADING) {
      return <Loader isLoading />;
    }

    return (
      <Fragment>
        {order && order.orderId === orderId && (
          <UpdateOrderForm
            notification={notification}
            updateOrders={updateOrders}
            order={order}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.order.status,
    notification: state.order.notification,
    order: state.order.order,
  };
}

const Actions = {
  getOrder,
  updateOrders,
};

export default connect(mapStateToProps, Actions)(UpdateOrderPage);
