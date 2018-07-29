/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Local variables
 */
const propTypes = {
  block: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  outline: PropTypes.bool,
  style: PropTypes.object,
  type: PropTypes.string,
};

const defaultProps = {
  block: false,
  primary: false,
  onClick: noop,
  outline: false,
  type: 'button',
};

/**
 * <Button />
 */
const Button = (props) => {
  let classes = cx({
    button: true,
    'button--primary': props.primary,
    'button--block': props.block,
    'button--outline': props.outline,
  }, props.className);

  return (
    <button
      type={props.type}
      className={classes}
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
