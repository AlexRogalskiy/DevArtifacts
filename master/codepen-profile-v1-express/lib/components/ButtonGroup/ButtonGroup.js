/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Local variables;
 */
const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  vertical: PropTypes.bool,
};

const defaultProps = {};

/**
 * <ButtonGroup />
 */
const ButtonGroup = ({
  className,
  children,
  style,
  vertical,
}) => {
  const classes = classNames({
    'button-group': true,
    'button-group--vertical': vertical,
  }, className);

  return (
    <div
      className={classes}
      style={style}
    >
      {children}
    </div>
  );
};

ButtonGroup.propTypes = propTypes;
ButtonGroup.defaultProps = defaultProps;

export default ButtonGroup;
