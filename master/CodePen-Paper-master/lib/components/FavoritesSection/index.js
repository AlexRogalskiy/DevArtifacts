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
import List, { ListItem } from '../List';
import SectionHeader from '../SectionHeader';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: null,
};

/**
 * Favorites Section Component
 *
 * @since 0.0.1
 */
class FavoritesSection extends Component {
  _renderTiles() {
    console.log('lol');
    return (
      <List>
        <ListItem
          leftColumn={<img src="/public/img/icon/codepen-paper-icon.svg" />}
          heading="Material Design Login Form"
          subHeading={<span>Created by <a>Andy Tran</a></span>}
        />
        <ListItem
          leftColumn={<img src="/public/img/icon/codepen-paper-icon.svg" />}
          rightColumn={<div>R</div>}
        >
          Item 1
        </ListItem>
        <ListItem>Item 2</ListItem>
        <ListItem>Item 3</ListItem>
      </List>
    )
  }

  render() {
    const { className, label } = this.props;

    const classes = classNames('favorites-section', className);

    return (
      <section className={classes}>
        <SectionHeader label="Favorites" />

        {this._renderTiles()}
      </section>
    );
  }
}

FavoritesSection.propTypes = propTypes;
FavoritesSection.defaultProps = defaultProps;

export default FavoritesSection;
