// @flow
import React, { PureComponent } from "react";

import Icon from "components/icon";

export type IconButtonProps = {
  icon: string,
  className?: string,
  onClick?: Function,
  disabled: boolean
};

export default class IconButton extends PureComponent<IconButtonProps> {
  static defaultProps = {
    disabled: false
  };

  handleClick(e: SyntheticEvent<HTMLElement>) {
    if (this.props.onClick !== undefined) {
      this.props.onClick(e);
    }
  }
  render() {
    const { className, icon, disabled } = this.props;
    return (
      <button
        onClick={this.handleClick.bind(this)}
        className={className}
        disabled={disabled}
      >
        <Icon icon={icon} fixedWidth />
      </button>
    );
  }
}
