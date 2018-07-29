/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

/**
 * Internal dependencies
 */
import config from '../../../config';

/**
 * Local variables
 */
const propTypes = {
  type: PropTypes.number,
};

const defaultProps = {};

/**
 * <Nav />
 */
const Nav = ({ type }) => {
  let navItems;

  switch (type) {
    case 1:
      navItems = (
        <nav className="nav">
          <Link
            activeClassName="nav__item--active"
            className="nav__item"
            to="/shots"
          >
            Shots
          </Link>
          <Link
            activeClassName="nav__item--active"
            className="nav__item"
            to="/projects"
          >
            Projects
          </Link>
          {config.env === 'development' ? <Link activeClassName="nav__item--active" className="nav__item" to="/sandbox">Sandbox</Link> : undefined}
        </nav>
      );
      break;
    default:
      navItems = (
        <nav className="nav">
          <Link
            activeClassName="nav__item--active"
            className="nav__item"
            to="/pens"
          >
            Pens
          </Link>
          <Link
            activeClassName="nav__item--active"
            className="nav__item"
            to="/posts"
          >
            Posts
          </Link>
          <Link
            activeClassName="nav__item--active"
            className="nav__item"
            to="/collections"
          >
            Collections
          </Link>
          {config.env === 'development' ? <Link activeClassName="nav__item--active" className="nav__item" to="/sandbox">Sandbox</Link> : undefined}
        </nav>
      );
      break;
  }

  return navItems;
};

Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;

export default Nav;
