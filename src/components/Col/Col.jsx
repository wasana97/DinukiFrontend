// @flow
import React from "react";
import classNames from "classnames";

import "./styles.scss";

type ColProps = {
  children: any,
  size?: string,
  xm?: string,
  sm?: string,
  md?: string,
  lg?: string,
  styles?: string,
  className?: string
};
export default function Col(props: ColProps) {
  const { xm, sm, md, lg, size, className, styles } = props;
  const colClass = [];
  if (size) {
    colClass.push(`col-${size}`);
  }
  if (xm) {
    colClass.push(`col-xm-${xm}`);
  }
  if (sm) {
    colClass.push(`col-sm-${sm}`);
  }
  if (md) {
    colClass.push(`col-md-${md}`);
  }
  if (lg) {
    colClass.push(`col-lg-${lg}`);
  }
  return (
    <div className={classNames("col", className, colClass)} style={styles}>
      {props.children}
    </div>
  );
}
