/**
 * External dependencies
 */
import React, { Component } from 'react';
import { Motion, spring, gentle } from 'react-motion';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { __BROWSER__ } from '../../../config';
import Logo from '../Logo';
import Link from '../Link';
import Navigation, { NavigationItem } from '../Navigation';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object,
  }),
};

const defaultProps = {
  className: undefined,
  location: undefined,
};

/**
 * Sidebar Component
 *
 * @since 0.0.1
 */
class Sidebar extends Component {
  _renderTitle() {
    const { location } = this.props;

    const isPens = location.pathname.substr(0, 5) === '/pens';

    const isPosts = location.pathname.substr(0, 6) === '/posts';

    const isCollections = location.pathname.substr(0, 12) === '/collections';

    let titleText;

    if (isPens) {
      titleText = 'Pens';
    } else if (isPosts) {
      titleText = 'Posts';
    } else if (isCollections) {
      titleText = 'Collections';
    }

    if (titleText) {
      return <h2 className="sidebar__title">{titleText}</h2>;
    }

    return false;
  }

  _renderNavigation() {
    const { location } = this.props;

    const isPens = location.pathname.substr(0, 5) === '/pens';

    const isPosts = location.pathname.substr(0, 6) === '/posts';

    const isCollections = location.pathname.substr(0, 12) === '/collections';

    let navigationItemRoute;

    if (isPens) {
      navigationItemRoute = '/pens';
    } else if (isPosts) {
      navigationItemRoute = '/posts';
    } else if (isCollections) {
      navigationItemRoute = '/collections';
    }

    if (isPens || isPosts || isCollections) {
      return (
        <Navigation direction="vertical">
          <NavigationItem active={location.pathname === navigationItemRoute} to={navigationItemRoute}>
            Picks
          </NavigationItem>
          <NavigationItem
            active={location.pathname === `${navigationItemRoute}/popular`}
            to={`${navigationItemRoute}/popular`}
          >
            Popular
          </NavigationItem>
          <NavigationItem
            active={location.pathname === `${navigationItemRoute}/recent`}
            to={`${navigationItemRoute}/recent`}
          >
            Recent
          </NavigationItem>
        </Navigation>
      );
    }

    return (
      <Navigation direction="vertical" large>
        <NavigationItem active to="/pens">Home</NavigationItem>
        <NavigationItem to="/pens">Pens</NavigationItem>
        <NavigationItem to="/posts">Posts</NavigationItem>
        <NavigationItem to="/collections">Collections</NavigationItem>
      </Navigation>
    );
  }

  _renderArrow() {
    const { location } = this.props;

    const isHome = location.pathname === '/';

    return (
      <Motion
        defaultStyle={{
          opacity: 0,
          x: 0,
        }}
        style={{
          opacity: spring(isHome ? 0 : 1, gentle),
          x: spring(isHome ? 0 : 20, gentle),
        }}
      >
      {interpolatingStyles => (
        <svg
          className="sidebar__arrow"
          height="24"
          style={{
            left: -interpolatingStyles.x,
            opacity: interpolatingStyles.opacity,
          }}
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M12.95 7.05L8 12l4.95 4.95 1.414-1.415L10.828 12l3.536-3.536z" />
        </svg>
      )}
    </Motion>
    );
  }

  render() {
    const { className, location } = this.props;

    const classes = classNames('sidebar', className);

    return (
      <aside className={classes}>
        <header className="sidebar__header">
          <Link to="/">
            <Logo />
            {this._renderArrow()}
          </Link>
        </header>
        {this._renderTitle()}
        {this._renderNavigation()}
      </aside>
    )
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
