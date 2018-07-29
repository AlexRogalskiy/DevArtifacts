/**
 * External dependencies
 */
import { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';

/**
 * Local variables
 */
const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const defaultProps = {
  children: undefined,
};

class PseudoClassComponent extends Component {
  constructor() {
    super();
    this.state = {
      hovered: false,
      focused: false,
    };
  }

  _handleBlur() {
    this.setState({ focused: false });
  }

  _handleFocus() {
    this.setState({ focused: true });
  }

  _handleMouseEnter() {
    this.setState({ hovered: true });
  }

  _handleMouseLeave() {
    this.setState({ hovered: false });
  }

  // Override this and wrap a stateless component
  render() {
    const { children, ...rest } = this.props;

    return cloneElement(
      children,
      {
        focused: this.state.focused,
        hovered: this.state.hovered,
        onBlur: () => this._handleBlur(),
        onFocus: () => this._handleFocus(),
        onMouseEnter: () => this._handleMouseEnter(),
        onMouseLeave: () => this._handleMouseLeave(),
        ...rest,
      },
    );
  }
}

PseudoClassComponent.propTypes = propTypes;
PseudoClassComponent.defaultProps = defaultProps;

export default PseudoClassComponent;
