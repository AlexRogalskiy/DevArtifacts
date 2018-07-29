/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
};

const defaultProps = {};

const SupportContainer = (props) => {
  let classes = classNames({
    'page-container': true,
    'page-container--support': true,
  }, props.className);

  return (
    <div className={classes}>
      {props.children}
    </div>
  );
};

SupportContainer.propTypes = propTypes;
SupportContainer.defaultProps = defaultProps;

export default SupportContainer;
