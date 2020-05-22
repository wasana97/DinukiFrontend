// @flow
import React, { PureComponent } from "react";
import "./styles.scss";

type CheckboxProps = {
  isChecked: boolean,
  text: string,
  onChange: Function,
  children: any,
  disabled: boolean
};

type CheckboxState = {
  isChecked: boolean
};

class Checkbox extends PureComponent<CheckboxProps, CheckboxState> {
  static defaultProps = {
    isChecked: false,
    onChange: () => {},
    disabled: false
  };

  state = {
    isChecked: false
  };

  toggleModal = (isChecked: boolean) => {
    this.setState(function() {
      return {
        isChecked
      };
    });
  };

  componentDidUpdate(prevProps: CheckboxProps) {
    if (prevProps.isChecked !== this.props.isChecked) {
      this.toggleModal(this.props.isChecked);
    }
  }

  render() {
    const { isChecked, text, onChange, children, disabled } = this.props;
    return (
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          disabled={disabled}
        />
        <span className="checkmark" />
        <label>{text}</label>
        {children}
      </div>
    );
  }
}

export default Checkbox;
