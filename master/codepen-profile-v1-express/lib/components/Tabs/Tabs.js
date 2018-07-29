/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

/**
 * Local variables
 */
const propTypes = {
  params: PropTypes.object,
};

const defaultProps = {};

/**
 * <Tabs />
 */
const Tabs = ({ params }) => (
  <nav className="tabs">
    <Link
      activeClassName="tabs__item--active"
      className="tabs__item"
      to={`/${params.view}/public`}
    >
      Public
    </Link>
    <Link
      activeClassName="tabs__item--active"
      className="tabs__item"
      to={`/${params.view}/popular`}
    >
      Popular
    </Link>
    <Link
      activeClassName="tabs__item--active"
      className="tabs__item"
      to={`/${params.view}/loved`}
    >
      Loved
    </Link>
    <Link
      activeClassName="tabs__item--active"
      className="tabs__item"
      to={`/${params.view}/forked`}
    >
      Forked
    </Link>
  </nav>
);

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
