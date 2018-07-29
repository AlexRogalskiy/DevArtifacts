/**
 * External dependencies
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import FavoritesSection from '../../components/FavoritesSection';

/**
 * Home Page
 *
 * @since 0.0.1
 */
class HomePage extends Component {
  render() {
    const { className } = this.props;

    const classes = classNames('page', 'is-home', className);

    return (
      <div className={classes}>
        <FavoritesSection />
      </div>
    );
  }
};

export default HomePage;
