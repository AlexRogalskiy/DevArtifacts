/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
  style: PropTypes.object,
};

const defaultProps = {};

/**
 * <Menu />
 */
class Menu extends Component {
  _renderItem(item, key) {
    return (
      <li
        key={`menu-item-${key}`}
        className="menu__item"
      >
        <a
          className="menu__link"
          href={item.url}
          onClick={item.onClick}
        >
          {item.value}
        </a>
      </li>
    );
  }

  render() {
    let classes = cx('menu', this.props.className);
    const items = this.props.items || [];

    return (
      <div
        className={classes}
        style={this.props.style}
      >
        <ul>
          {items.map(this._renderItem.bind(this))}
        </ul>
      </div>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

export default Menu;
