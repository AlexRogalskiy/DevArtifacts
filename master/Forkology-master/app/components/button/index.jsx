/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
  round: PropTypes.bool,
  style: PropTypes.object,
};

const defaultProps = {
  type: 'button',
  onClick: noop,
};

/**
 * <Button />
 */
const Button = (props) => {
  let classes = classNames({
    btn: true,
    'btn-round': props.round,
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
