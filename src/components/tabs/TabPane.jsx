// @flow
import type { Element } from "react";
import React from "react";
import classNames from "classnames";

type TabPaneProps = {
  children: | Array<Element<any> | string | typeof undefined>
    | Element<any>
    | string
    | typeof undefined,
  isActive: boolean
};

export default function TabPane({ children, isActive }: TabPaneProps) {
  return (
    <div className={classNames("tab-pane", { active: isActive })}>
      {children}
    </div>
  );
}
