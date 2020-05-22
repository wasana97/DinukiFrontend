// @flow
import React, { Component } from "react";
import { connect } from "react-redux";

import Layout from "components/mainLayout";
import Link from "components/Link";

import "./styles.scss";

type HomePageProps = {
  user: Object,
};

class HomePage extends Component<HomePageProps> {
  render() {
    const {
      user: { role },
    } = this.props;
    return (
      <Layout>
        <div className="main-page">
          <div className="main-page-links">
            {role === "Admin" && (
              <Link to={"admin/users"}>
                <div className="main-page-links-item">Admin Management</div>
              </Link>
            )}
            {(role === "Admin" || role === "Store Keeper") && (
              <Link to={"product/create"}>
                <div className="main-page-links-item">Stock Management</div>
              </Link>
            )}
            {(role === "Admin" ||
              role === "Store Keeper" ||
              role === "Cashier") && (
              <Link to={"cashier"}>
                <div className="main-page-links-item">Cashier Management</div>
              </Link>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

const Actions = {};

export default connect(mapStateToProps, Actions)(HomePage);
