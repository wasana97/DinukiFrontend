// @flow
import React from "react";
import classNames from "classnames";

import "./styles.scss";

type RowProps = {
  children: any,
  equalHeight?: boolean,
  fullHeight?: boolean,
  fullWidth?: boolean,
  columnPosition?: "string",
  className?: string
};

export default function Row(props: RowProps) {
  const { equalHeight, fullWidth, className } = props;
  return (
    <div
      className={classNames(
        "row",
        { "eq-height": equalHeight },
        { "full-width": fullWidth },
        className
      )}
    >
      {props.children}
    </div>
  );
}

Row.defaultProps = {
  equalHeight: false,
  fullWidth: false
};
