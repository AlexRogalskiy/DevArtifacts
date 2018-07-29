/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Local variables
 */
const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
};

const defaultProps = {
  size: 12,
};

const Column = (props) => {
  if (props.size > 12) {
    return false;
  }

  let classes = cx('column', `column--${props.size}`, props.className);

  return (
    <div className={classes} style={props.style}>
      {props.children}
    </div>
  );
};

Column.propTypes = propTypes;
Column.defaultProps = defaultProps;

export default Column;
