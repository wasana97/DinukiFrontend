// @flow
import { lazy } from "react";

export default [
  {
    path: "/login",
    exact: true,
    auth: false,
    component: lazy(() => import("./pages/auth"))
  }
];
