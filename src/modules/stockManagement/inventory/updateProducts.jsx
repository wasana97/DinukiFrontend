// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Loader from "components/loader";
import UpdateProductForm from "./components/updateProductForm";

import { ASYNC_STATUS } from "constants/async";
import { getProduct, updateProduct } from "action/product";

import "./styles.scss";

type UpdateProductPageProps = {
  getProduct: Function,
  updateProduct: Function,
  status: AsyncStatusType,
  notification: NotificationType,
  product: Object | null,
  match: {
    params: {
      productCode: number,
    },
  },
};
class UpdateProductPage extends Component<UpdateProductPageProps> {
  componentDidMount() {
    const {
      match: {
        params: { productCode },
      },
    } = this.props;

    this.props.getProduct(productCode);
  }

  render() {
    const {
      status,
      notification,
      updateProduct,
      product,
      match: {
        params: { productCode },
      },
    } = this.props;

    if (status === ASYNC_STATUS.LOADING) {
      return <Loader isLoading />;
    }

    return (
      <Fragment>
        {product && product.productCode === productCode && (
          <UpdateProductForm
            notification={notification}
            updateProduct={updateProduct}
            product={product}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.product.status,
    notification: state.product.notification,
    product: state.product.product,
  };
}

const Actions = {
  getProduct,
  updateProduct,
};

export default connect(mapStateToProps, Actions)(UpdateProductPage);
