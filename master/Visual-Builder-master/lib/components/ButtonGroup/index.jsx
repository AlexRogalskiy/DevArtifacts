/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * <ButtonGroup />
 */
const ButtonGroup = (props) => {
  const classes = classNames({
    'button-group': true,
    'button-group--block': props.block,
    'button-group--vertical': props.vertical,
  }, props.className);

  return <div className={classes} style={props.style}>{props.children}</div>;
};

ButtonGroup.defaultProps = {
  block: undefined,
  className: undefined,
  children: undefined,
  style: undefined,
  vertical: undefined,
};

ButtonGroup.propTypes = {
  block: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  vertical: PropTypes.bool,
};

export default ButtonGroup;
