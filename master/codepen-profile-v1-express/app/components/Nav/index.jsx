/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { IndexLink, Link } from 'react-router';

/**
 * External dependencies
 */
import './style.scss';

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  menus: PropTypes.array,
};

const defaultProps = {};

/**
 * <Nav />
 */
class Nav extends Component {
  _renderItem(item, index) {
    let linkItem;

    if (item.index) {
      linkItem = (
        <IndexLink
          className="nav__link"
          activeClassName="nav__link--active"
          to={item.url}
        >
          <span dangerouslySetInnerHTML={{ __html: item.children }} />
        </IndexLink>
      );
    } else if (item.anchor) {
      linkItem = (
        <a
          className="nav__link"
          href={item.url}
          dangerouslySetInnerHTML={{ __html: item.children }}
        />
      );
    } else {
      linkItem = (
        <Link
          className="nav__link"
          activeClassName="nav__link--active"
          to={item.url}
        >
          <span dangerouslySetInnerHTML={{ __html: item.children }} />
        </Link>
      );
    }

    return (
      <li
        key={`nav-item-${index}`}
        className="nav__item"
      >
        {linkItem}
      </li>
    );
  }

  _renderMenu(menu, index) {
    return (
      <ul
        key={`nav-menu-${index}`}
        className="nav__menu"
      >
        {menu.map(this._renderItem.bind(this))}
      </ul>
    );
  }

  render() {
    let classes = cx('nav', this.props.className);

    return (
      <nav className={classes}>
        {this.props.menus.map(this._renderMenu.bind(this))}
      </nav>
    );
  }
}

Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;

export default Nav;
