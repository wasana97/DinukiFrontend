// @flow
import React, { PureComponent } from "react";
import classNames from "classnames";

import "./styles.scss";

export type IconProps = {
  icon: string,
  className: string,
  color: string,
  onClick?: Function
};

class Icon extends PureComponent<IconProps> {
  static defaultProps = {
    className: "",
    color: ""
  };
  render() {
    const { icon, className, color, onClick } = this.props;
    return (
      <i
        className={classNames("icon", `icon-${icon}`, className)}
        style={{ color }}
        onClick={onClick}
      />
    );
  }
}

export default Icon;
