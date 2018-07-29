/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { __BROWSER__ } from '../../../config';
import ListItem from '../ListItem';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const defaultProps = {
  className: null,
  children: null,
};

/**
 * List Component
 *
 * @since 0.0.1
 */
const List = ({ children, className }) => {
  const classes = classNames('list', className);

  return <div className={classes}>{children}</div>;
}

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export {
  List as default,
  ListItem,
};
