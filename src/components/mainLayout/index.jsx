// @flow
import React from "react";
import Header from "components/mainHeader";

import "./styles.scss";

type LayoutProps = {
  children: Element,
  breadcrumbs?: String[],
  actions?: Element,
  status?: string
};

export default function layout({
  children,
  breadcrumbs,
  actions,
  status
}: LayoutProps) {
  const breadcrumbsContent =
    breadcrumbs !== undefined
      ? breadcrumbs.map(breadcrumb => <li key={breadcrumb}>{breadcrumb}</li>)
      : null;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Header />
        <div className="dashboard-content">
          <div className="dashboard-content-header">
            <div className="status-bar">
              {breadcrumbs !== undefined && (
                <ul className="breadcrumbs">{breadcrumbsContent}</ul>
              )}
              {status !== undefined && (
                <div className={`status ${status}`}>{status}</div>
              )}
            </div>
            {actions !== undefined && (
              <div className={"action-bar"}>{actions}</div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
