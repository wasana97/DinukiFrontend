import React from "react";
import Layout from "components/mainLayout";
import notFound from "assets/image/404.svg";

import "./styles.scss";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="container">
        <div className="helper-page">
          <img src={notFound} alt="Not Found" />
          <div className="heading-2">Oops!</div>
          <div className="heading-4">Page not found.</div>
        </div>
      </div>
    </Layout>
  );
}
