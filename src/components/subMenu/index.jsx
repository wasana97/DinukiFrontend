// @flow
import React, { useState } from "react";
import classNames from "classnames";
import { Link, withRouter, location } from "react-router-dom";
import Icon from "components/icon";

import "./styles.scss";

type SubMenuProps = {
  title: String,
  icon: null | String,
  items?: { title: String, link?: String }[],
  location: location
};

function SubMenu({ title, icon, items, location: { pathname } }: SubMenuProps) {
  let initiallyIsOpen = false;
  items !== undefined &&
    items.map(({ link }) => {
      if (pathname === link) {
        initiallyIsOpen = true;
      }
      return true;
    });
  const [isOpen, setIsOpen] = useState(initiallyIsOpen);
  return (
    <div className={classNames("sub-menu", { open: isOpen })}>
      <div className="sub-menu-title" onClick={() => setIsOpen(!isOpen)}>
        <div className="sub-menu-title-inner">
          {icon !== undefined && <Icon icon={icon} />}
          <span>{title}</span>
        </div>
        <div className="sub-menu-icon">
          <Icon icon="chevron-down" />
        </div>
      </div>
      {items !== undefined && isOpen && (
        <div className="sub-menu-items">
          {items.map(({ title, link }, key) => (
            <div
              className={classNames("sub-menu-item", {
                active: pathname === link
              })}
              key={key}
            >
              <Link to={link}>{title}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withRouter(SubMenu);
