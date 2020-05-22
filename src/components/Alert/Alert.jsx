// @flow
import React from "react";
import classNames from "classnames";

import "./styles.scss";

const TYPE = {
  SUCCESS: "alert-success",
  ERROR: "alert-danger",
  LIGHT: "alert-light",
  INFO: "alert-info"
};

type AlertProps = {
  isFullWidth: boolean,
  children: any,
  type: typeof TYPE.SUCCESS | typeof TYPE.ERROR | typeof TYPE.INFO
};

function Alert(props: AlertProps) {
  const { children, type, isFullWidth } = props;
  return (
    <div className={classNames("alert", { "full-width": isFullWidth }, type)}>
      {children}
    </div>
  );
}

Alert.TYPE = TYPE;

Alert.defaultProps = {
  type: TYPE.INFO,
  isFullWidth: false
};

export default Alert;
