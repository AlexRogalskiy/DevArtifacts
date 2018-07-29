/**
 * External dependencies
 */
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

/**
 * Internal dependencies
 */
import config from '../config';
import routes from '../lib/routes';

if (config.browser) require('./style.scss');

/**
 * Render application
 */
if (config.env === 'development' && module.hot) {
  module.hot.accept();

  const Root = () => <Router history={browserHistory} routes={routes} />;

  render(<Root />, document.getElementById('app'));
} else {
  render(<Router history={browserHistory} routes={routes} />, document.getElementById('app'));
}
