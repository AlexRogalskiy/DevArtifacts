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

const IndexContainer = (props) => {
  let classes = classNames({
    'page-container': true,
    'page-container--index': true,
  }, props.className);

  return (
    <div className={classes}>
      {props.children}
    </div>
  );
};

IndexContainer.propTypes = propTypes;
IndexContainer.defaultProps = defaultProps;

export default IndexContainer;
