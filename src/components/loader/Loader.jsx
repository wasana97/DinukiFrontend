// @flow
import React from "react";

import "./styles.css";

type LoaderProps = {
  isLoading: boolean,
  error?: any
};

function loader(props: LoaderProps) {
  const { isLoading, error } = props;
  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <div className="lds-ring">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
  // Handle the error state
  else if (error) {
    return <div>{"Sorry, there was a problem loading the page."}</div>;
  } else {
    return null;
  }
}

export default loader;
