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
  items: PropTypes.array,
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
          <span className="nav__icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
          <span dangerouslySetInnerHTML={{ __html: item.children }} />
        </IndexLink>
      );
    } else if (item.anchor) {
      linkItem = (
        <a
          className="nav__link"
          href={item.url}
        >
          <span className="nav__icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
          <span dangerouslySetInnerHTML={{ __html: item.children }} />
        </a>
      );
    } else {
      linkItem = (
        <Link
          className="nav__link"
          activeClassName="nav__link--active"
          to={item.url}
        >
          <span className="nav__icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
          <span dangerouslySetInnerHTML={{ __html: item.children }} />
        </Link>
      );
    }

    return (
      <li
        key={`mobile-nav-item-${index}`}
        className="nav__item"
      >
        {linkItem}
      </li>
    );
  }

  render() {
    let classes = cx('nav nav--mobile', this.props.className);

    return (
      <nav className={classes}>
        <ul className="nav__menu">
          {this.props.items.map(this._renderItem.bind(this))}
        </ul>
      </nav>
    );
  }
}

Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;

export default Nav;
