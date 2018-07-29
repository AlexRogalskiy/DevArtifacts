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
import NavigationItem from '../NavigationItem';

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
  direction: PropTypes.string,
  large: PropTypes.bool,
};

const defaultProps = {
  className: undefined,
  children: undefined,
  direction: 'horizontal',
  large: undefined,
};

/**
 * Navigation Component
 *
 * @since 0.0.1
 */
const Navigation = ({ children, className, direction, large }) => {
  const classes = classNames({
    navigation: true,
    'is-horizontal': direction === 'horizontal',
    'is-large': large,
    'is-vertical': direction === 'vertical',
  }, className);

  return <nav className={classes}>{children}</nav>;
}

Navigation.propTypes = propTypes;
Navigation.defaultProps = defaultProps;

export {
  Navigation as default,
  NavigationItem,
};
