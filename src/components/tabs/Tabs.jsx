// @flow
import React, { useState } from "react";
import classnames from "classnames";

import TabPane from "./TabPane";

import "./styles.scss";

export type TabType = {
  title: string,
  content: any
};

type TabsProps = {
  items: Array<TabType>
};

export default function Tabs({ items }: TabsProps) {
  const [activeTab, toggleTab] = useState(0);

  const isActive = index => activeTab === index;

  const tabHeader = items.map(({ title }, index) => {
    return (
      <div
        key={index}
        className={classnames({
          active: isActive(index)
        })}
        onClick={() => {
          toggleTab(index);
        }}
      >
        {title}
      </div>
    );
  });

  let tabBody = null;
  items.map(({ content }, index) => {
    if (isActive(index)) {
      tabBody = (
        <TabPane key={index} isActive={true}>
          {content}
        </TabPane>
      );
    }
    return true;
  });

  return (
    <div className="tabs">
      <div className="tab-headers">{tabHeader}</div>
      <div className="tab-content">{tabBody}</div>
    </div>
  );
}
