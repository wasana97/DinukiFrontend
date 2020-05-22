// @flow
import React from "react";
import { Link } from "react-router-dom";

export default function link({
  to,
  children,
  ...rest
}: {
  to: string,
  children: any
}) {
  return (
    <Link to={`/${to}`} {...rest}>
      {children}
    </Link>
  );
}
