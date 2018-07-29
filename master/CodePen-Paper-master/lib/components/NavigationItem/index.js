/**
 * External dependencies
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { __BROWSER__ } from '../../../config';
import Link from '../Link';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Local variables
 */
const propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  href: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  active: undefined,
  className: undefined,
  href: undefined,
  to: undefined,
  onClick: undefined,
};

/**
 * NavigationItem Component
 *
 * @since 0.0.1
 */
const NavigationItem = ({ active, children, className, href, onClick, to }) => {
  const classes = classNames({
    'navigation-item': true,
    'is-active': active,
  }, className);

  return (
    <Link
      className={classes}
      href={href}
      onClick={onClick}
      to={to}
    >
      {children}
    </Link>
  );
}

NavigationItem.propTypes = propTypes;
NavigationItem.defaultProps = defaultProps;

export default NavigationItem;
