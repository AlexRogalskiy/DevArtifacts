/**
 * External dependencies
 */
import React from 'react';
import { Router, browserHistory, Route, IndexRoute } from 'react-router';

/**
 * Internal dependencies
 */
import Index from './index';
import Home from './home';
import Support from './support';

const Routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={Home} />
    </Route>
    <Route path="/support" component={Support}>
      <IndexRoute />
    </Route>
  </Router>
);

export default Routes;