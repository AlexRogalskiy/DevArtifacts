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
  className: PropTypes.string,
  style: PropTypes.object,
};

const defaultProps = {};

/**
 * <Loader />
 */
const Loader = (props) => {
  let classes = cx('loader', props.className);

  return (
    <div className={classes} style={props.style} />
  );
};

Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;

export default Loader;
