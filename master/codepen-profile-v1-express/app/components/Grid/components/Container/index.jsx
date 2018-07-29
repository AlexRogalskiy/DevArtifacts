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
  fluid: PropTypes.bool,
  style: PropTypes.object,
};

const defaultProps = {};

const Container = (props) => {
  let classes = cx({
    container: true,
    'container--fluid': props.fluid,
  }, props.className);

  return (
    <div className={classes} style={props.style}>
      {props.children}
    </div>
  );
};

Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

export default Container;
