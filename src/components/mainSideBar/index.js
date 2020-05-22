// @flow
import React, { PureComponent } from "react";
import { Link, location, withRouter } from "react-router-dom";
import classNames from "classnames";

import Icon from "components/icon";
import SideBarContent from "constants/sideBar";
import { isConsistWith } from "shared/utils";

import "./styles.scss";

type SidebarProps = {
  location: location
};

type SidebarState = {
  activeMainCategory: string,
  showContent: boolean
};

class Sidebar extends PureComponent<SidebarProps, SidebarState> {
  CATEGORIES = {
    DASHBOARD: "dashboard",
    PURCHASES: "purchases",
    INVENTORY: "inventory",
    SALES: "sales",
    CUSTOMERS: "customers",
    SUPPLIERS: "suppliers",
    SETTINGS: "settings"
  };

  constructor(props) {
    super(props);

    this.state = {
      activeMainCategory: this.CATEGORIES.DASHBOARD,
      showContent: true
    };

    // $FlowFixMe
    this.onClickMainCategory = this.onClickMainCategory.bind(this);
    // $FlowFixMe
    this.getSideBarContents = this.getSideBarContents.bind(this);
    // $FlowFixMe
    this.showSideMenu = this.showSideMenu.bind(this);
    // $FlowFixMe
    this.hideSideMenu = this.hideSideMenu.bind(this);
    // $FlowFixMe
    this.changeLocation = this.changeLocation.bind(this);
  }

  componentDidMount() {
    const {
      location: { pathname }
    } = this.props;

    this.setState({
      ...this.state,
      activeMainCategory:
        pathname !== "/" && localStorage.getItem("active-sidebar-category")
          ? localStorage.getItem("active-sidebar-category")
          : this.CATEGORIES.DASHBOARD
    });
  }

  changeLocation(activeMainCategory) {
    localStorage.setItem("active-sidebar-category", activeMainCategory);
  }

  getSideBarContents() {
    const {
      location: { pathname }
    } = this.props;

    const { activeMainCategory } = this.state;

    return SideBarContent.map(({ title, subMenu, content }) => {
      if (title === activeMainCategory) {
        if (subMenu) {
          return subMenu.map(({ category, content }, key) => {
            return (
              <div key={key} className="side-flip-container">
                <div
                  className={classNames("category-header", {
                    activeTitle: isConsistWith(pathname, content)
                  })}
                >
                  {category}
                </div>
                <div className="category-sub-menu">
                  {content.map(({ link, title }, key) => {
                    return (
                      <div
                        className={classNames("sub-category-item", {
                          active: pathname === link
                        })}
                        key={key}
                        onClick={() => this.changeLocation(activeMainCategory)}
                      >
                        <Link to={link}>{title}</Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        }
        if (content) {
          return (
            <div key={title} className="side-flip-container">
              <div className="category-header">{activeMainCategory}</div>
              {content.map(({ title, link }, key) => {
                return (
                  <div key={key} className="category-sub-menu">
                    <div
                      className={classNames("sub-category-item", {
                        active: pathname === link
                      })}
                      onClick={() => this.changeLocation(activeMainCategory)}
                    >
                      <Link to={link}>{title}</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }
      }
      return null;
    });
  }

  onClickMainCategory(selectedCategory) {
    localStorage.setItem("active-sidebar-category", selectedCategory);

    this.setState({
      ...this.state,
      activeMainCategory: selectedCategory,
      showContent: true
    });
  }

  showSideMenu() {
    this.setState({
      ...this.state,
      showContent: true
    });
  }

  hideSideMenu() {
    this.setState({
      ...this.state,
      showContent: false
    });
  }

  render() {
    let { activeMainCategory, showContent } = this.state;

    return (
      <div
        className={`main-side-bar-container ${activeMainCategory ===
          this.CATEGORIES.DASHBOARD && "main-side-bar-dashboard-container"}`}
      >
        <div className="sidebar">
          <div className="avatar">
            <Icon icon="profile" />
          </div>
          <div
            className={`menu-item ${activeMainCategory ===
              this.CATEGORIES.DASHBOARD && "active"}`}
            onClick={() => this.onClickMainCategory(this.CATEGORIES.DASHBOARD)}
          >
            <Link to="/">
              <Icon icon="bar-chart" />
              <span>Dashboard</span>
            </Link>
          </div>
          <div
            className={`menu-item ${activeMainCategory ===
              this.CATEGORIES.PURCHASES && "active"}`}
            onClick={() => this.onClickMainCategory(this.CATEGORIES.PURCHASES)}
          >
            <Link to="/purchases">
              <Icon icon="bag" />
              <span>Purchases</span>
            </Link>
          </div>
          <div
            className={`menu-item ${activeMainCategory ===
              this.CATEGORIES.INVENTORY && "active"}`}
            onClick={() => this.onClickMainCategory(this.CATEGORIES.INVENTORY)}
          >
            <Link to="/products">
              <Icon icon="boxes" />
              <span>Inventory</span>
            </Link>
          </div>
          <div
            className={`menu-item ${activeMainCategory ===
              this.CATEGORIES.SALES && "active"}`}
            onClick={() => this.onClickMainCategory(this.CATEGORIES.SALES)}
          >
            <Link to="/sales">
              <Icon icon="tag" />
              <span>Sales</span>
            </Link>
          </div>
          <div
            className={`menu-item ${activeMainCategory ===
              this.CATEGORIES.CUSTOMERS && "active"}`}
            onClick={() => this.onClickMainCategory(this.CATEGORIES.CUSTOMERS)}
          >
            <Link to="/customers">
              <Icon icon="person" />
              <span>Customers</span>
            </Link>
          </div>
          <div
            className={`menu-item ${activeMainCategory ===
              this.CATEGORIES.SUPPLIERS && "active"}`}
            onClick={() => this.onClickMainCategory(this.CATEGORIES.SUPPLIERS)}
          >
            <Link to="/suppliers">
              <Icon icon="plug" />
              <span>suppliers</span>
            </Link>
          </div>
          <div
            className={`menu-item ${activeMainCategory ===
              this.CATEGORIES.SETTINGS && "active"}`}
            onClick={() => this.onClickMainCategory(this.CATEGORIES.SETTINGS)}
          >
            <Link to="/settings/company">
              <Icon icon="settings" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
        {activeMainCategory !== this.CATEGORIES.DASHBOARD && showContent && (
          <div className="side-menu-bar">{this.getSideBarContents()}</div>
        )}
      </div>
    );
  }
}

export default withRouter(Sidebar);
