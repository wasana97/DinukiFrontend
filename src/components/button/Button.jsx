// @flow
import type { Element } from "react";

import React, { PureComponent } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import "./styles.scss";

const SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  DEFAULT: "default",
  LARGE: "large"
};

const HTML_TYPE = {
  BUTTON: "button",
  SUBMIT: "submit",
  LINK: "Link"
};

const TYPE = {
  DEFAULT: "default",
  PRIMARY: "primary",
  INFO: "info",
  LIGHT: "light",
  SUCCESS: "success",
  DANGER: "danger"
};

type ButtonProps = {
  type: | typeof TYPE.DEFAULT
    | typeof TYPE.PRIMARY
    | typeof TYPE.INFO
    | typeof TYPE.LIGHT
    | typeof TYPE.SUCCESS
    | typeof TYPE.DANGER,
  size: typeof SIZE.SMALL | typeof SIZE.MEDIUM | typeof SIZE.LARGE,
  outline?: boolean,
  fullWidth?: boolean,
  className?: string,
  link?: string,
  htmlType?: | typeof HTML_TYPE.BUTTON
    | typeof HTML_TYPE.SUBMIT
    | typeof HTML_TYPE.LINK,
  children: | Array<Element<any> | string | typeof undefined>
    | Element<any>
    | string
    | typeof undefined,
  onClick?: Function,
  loading: boolean,
  disabled: boolean
};

class Button extends PureComponent<ButtonProps> {
  static SIZE = SIZE;

  static HTML_TYPE = HTML_TYPE;

  static TYPE = TYPE;

  static defaultProps = {
    type: TYPE.PRIMARY,
    size: SIZE.MEDIUM,
    outline: false,
    fullWidth: false,
    htmlType: HTML_TYPE.BUTTON,
    loading: false,
    disabled: false
  };

  handleClick(e: SyntheticEvent<HTMLElement>) {
    if (this.props.onClick !== undefined) {
      this.props.onClick(e);
    }
  }

  getButtonContent = () => {
    return this.props.loading ? (
      <div className="loading">
        <div className="loader-spin" />
      </div>
    ) : (
      this.props.children
    );
  };

  render() {
    const {
      link,
      type,
      size,
      outline,
      className,
      fullWidth,
      htmlType,
      loading,
      disabled
    } = this.props;
    const buttonClasses = classNames(
      "btn",
      `btn-${type}`,
      `btn-${size}`,
      className,
      { "full-width": fullWidth },
      {
        "btn-outline": outline
      },
      {
        "is-loading": loading
      }
    );

    return htmlType === HTML_TYPE.LINK && link !== undefined ? (
      <Link
        to={link}
        onClick={this.handleClick.bind(this)}
        className={buttonClasses}
      >
        {this.getButtonContent()}
      </Link>
    ) : (
      <button
        onClick={this.handleClick.bind(this)}
        type={htmlType}
        className={buttonClasses}
        disabled={loading || disabled}
      >
        {this.getButtonContent()}
      </button>
    );
  }
}

export default Button;
