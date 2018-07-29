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
 * <LoadingBar />
 */
const LoadingBar = (props) => {
  let classes = cx('loading-bar', props.className);

  return (
    <div className={classes} />
  );
};

LoadingBar.propTypes = propTypes;
LoadingBar.defaultProps = defaultProps;

export default LoadingBar;
