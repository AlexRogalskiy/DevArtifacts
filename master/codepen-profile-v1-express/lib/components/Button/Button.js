/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';
import { noop } from 'lodash';

/**
 * Local variables;
 */
const propTypes = {
  block: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  outline: PropTypes.bool,
  primary: PropTypes.bool,
  style: PropTypes.object,
  round: PropTypes.bool,
  type: PropTypes.string,
};

const defaultProps = {
  block: undefined,
  onClick: noop,
  outline: undefined,
  primary: undefined,
  round: undefined,
  type: 'button',
};

/**
 * <Button />
 */
const Button = ({
  block,
  children,
  className,
  onClick,
  outline,
  primary,
  round,
  style,
  type,
}) => {
  const classes = cx({
    button: true,
    'button--block': block,
    'button--outline': outline,
    'button--round': round,
    'button--primary': primary,
  }, className);

  return (
    <button
      type={type}
      className={classes}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
