// @flow
import React from "react";
import classNames from "classnames";

import "./styles.scss";

type InputProps = {
  text: string,
  placeholder: string,
  name?: string,
  id?: string,
  onChange: Function,
  type: string,
  error: null | string,
  className: string,
  onBlur: Function,
  onFocus: Function,
  autoComplete: boolean,
  disabled: boolean,
  onKeyPress?: Function
};

export default function Input(props: InputProps) {
  const {
    text,
    placeholder,
    name,
    id,
    onChange,
    type,
    error,
    className,
    onBlur,
    onFocus,
    autoComplete,
    disabled,
    onKeyPress
  } = props;
  const hasErrors = error !== null;
  return (
    <div
      className={classNames(
        "form-input",
        { "has-errors": hasErrors },
        className
      )}
    >
      <input
        autoComplete={autoComplete.toString()}
        name={name}
        id={id}
        placeholder={placeholder}
        value={text === null ? "" : text}
        onChange={event => onChange(event.target.value)}
        type={type}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        onKeyPress={onKeyPress}
      />
      {getFieldErrors(error)}
    </div>
  );
}

function getFieldErrors(error: string | null) {
  return error !== null && <div className="form-errors">{error}</div>;
}

Input.defaultProps = {
  type: "text",
  error: null,
  className: "",
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  autoComplete: true,
  disabled: false
};
