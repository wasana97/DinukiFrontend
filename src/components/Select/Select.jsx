// @flow
import React, { Component, Fragment } from "react";
import classnames from "classnames";

import Icon from "components/icon";

import "./styles.scss";

type SelectObject = {
  value: string,
  name: string
};

type SelectInputType = SelectObject | string;

type SelectProps = {
  onChange: Function,
  options: SelectInputType[],
  name: string,
  placeholder?: string,
  defaultSelected: boolean,
  searchable: boolean,
  selected: string,
  error: null | string,
  disabled: boolean
};

type SelectState = {
  isOpen: boolean,
  options: SelectObject[],
  selectedName: string | null,
  selectedValue: string | null
};

class Select extends Component<SelectProps, SelectState> {
  static defaultProps = {
    onChange: () => {},
    defaultSelected: false,
    searchable: false,
    selected: "",
    error: null,
    disabled: false
  };

  constructor(props: SelectProps) {
    super(props);
    this.state = {
      isOpen: false,
      selectedValue: null,
      selectedName: null,
      options: []
    };

    //$FlowFixMe Forced to do that for perf issues
    this.onClickInput = this.onClickInput.bind(this);
    // $FlowFixMe
    this.toggleDropdown = this.toggleDropdown.bind(this);
    // $FlowFixMe
    this.closeDropdown = this.closeDropdown.bind(this);
    // $FlowFixMe
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const options = this.getFormattedOptions(this.props);
    this.setState({
      options
    });
  }

  componentDidUpdate(prevProps: SelectProps) {
    if (prevProps.options !== this.props.options) {
      const options = this.getFormattedOptions(this.props);
      this.setState({
        options
      });
    }
  }

  getFormattedOptions(props: SelectProps) {
    const { options, selected } = props;
    // $FlowFixMe
    return options.map((option, key) => {
      let name, value;
      if (typeof option === "object") {
        name = option.name;
        value = option.value;
      } else {
        name = option;
        value = option;
      }
      if (
        value &&
        selected &&
        selected !== "" &&
        selected !== null &&
        value.toString() === selected.toString()
      ) {
        this.setState({
          selectedName: name,
          selectedValue: value
        });
      } else if (this.props.defaultSelected && key === 0) {
        this.setState({
          selectedName: name,
          selectedValue: value
        });
      } else if (selected === null || selected === "") {
        this.setState({
          selectedName: null,
          selectedValue: null
        });
      }
      return {
        name,
        value
      };
    });
  }

  toggleDropdown() {
    const { options } = this.props;
    if (options && options.length > 0) {
      this.setState(({ isOpen }) => ({
        isOpen: !isOpen
      }));
    }
  }

  closeDropdown() {
    this.setState({
      isOpen: false
    });
  }

  onClick(
    name: $PropertyType<SelectObject, "name">,
    value: $PropertyType<SelectObject, "value">
  ) {
    this.setState({
      selectedName: name,
      selectedValue: value,
      isOpen: false
    });
    this.props.onChange(value);
  }

  onSearchChange(e: SyntheticEvent<HTMLButtonElement>) {
    const options = this.getFormattedOptions(this.props);
    const userInput = e.currentTarget.value;

    // Filter our options that don't contain the user's input
    let filteredOptions = options.filter(
      option => option.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    if (filteredOptions.length === 0) {
      filteredOptions = [
        {
          name: "No Results",
          value: "no-results"
        }
      ];
    }

    this.setState({
      options: filteredOptions
    });
  }

  onClickInput() {
    this.setState({
      isOpen: true
    });
  }

  getOptions = () => {
    const { options } = this.state;
    const { searchable } = this.props;

    if (options && options.length > 0) {
      return (
        <Fragment>
          {searchable && (
            <li key="search" className="search-input">
              <Icon icon="search" />
              <input
                onClick={this.onClickInput}
                onChange={this.onSearchChange.bind(this)}
              />
            </li>
          )}
          {options.map(({ value, name }, key) => (
            <li
              key={`${key}_${value}`}
              onClick={() => {
                value !== "no-results" && this.onClick(name, value);
              }}
            >
              {name}
            </li>
          ))}
        </Fragment>
      );
    }
  };

  getFieldErrors(error: string | null) {
    return error !== null ? (
      <ul className="form-errors">
        <li>{error}</li>
      </ul>
    ) : (
      ""
    );
  }

  render() {
    const { isOpen, selectedName, selectedValue } = this.state;
    const { options, placeholder, error, disabled } = this.props;
    const isSelected = selectedName !== null || selectedValue !== null;
    const hasErrors = error !== null;

    return (
      <div className="form-group">
        <div
          className={classnames("form-select", {
            "dropdown-open": isOpen && !disabled,
            "has-errors": hasErrors
          })}
        >
          <div className="selected-dropdown" onClick={this.toggleDropdown}>
            {isSelected ? (
              <span>{selectedName}</span>
            ) : (
              <span className="placeholder">{placeholder}</span>
            )}
            <span className="selector pull-right">
              {isOpen && !disabled && options && options.length > 0 ? (
                <Icon icon="chevron-up" />
              ) : (
                <Icon icon="chevron-down" />
              )}
            </span>
          </div>
          <div className="dropdown-container">
            <ul className="dropdown">{this.getOptions()} </ul>
          </div>
        </div>
        {isOpen && <div className="backdrop" onClick={this.closeDropdown} />}
        {this.getFieldErrors(error)}
      </div>
    );
  }
}

export default Select;
