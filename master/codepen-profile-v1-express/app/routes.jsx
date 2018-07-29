/**
 * External dependencies
 */
import React from 'react';
import { Router, IndexRoute, Route, Redirect, browserHistory } from 'react-router';

/**
 * Internal dependencies
 */
import AppContainer from './containers/AppContainer';
import CollectionsPage from './pages/CollectionsPage';
import FollowersPage from './pages/FollowersPage';
import FollowingPage from './pages/FollowingPage';
import PensPage from './pages/PensPage';
import PostsPage from './pages/PostsPage';
import ProfilePage from './pages/ProfilePage';
import TrendingPage from './pages/TrendingPage';
import ErrorPage from './pages/ErrorPage';

const Routes = (
  <Router
    history={browserHistory}
    onUpdate={() => window.scrollTo(0, 0)}
  >
    <Route path="/" component={AppContainer}>
      <IndexRoute component={PensPage} />
      <Redirect from="pens" to="/" />
      <Route path="posts" component={PostsPage} />
      <Route path="collections" component={CollectionsPage} />
      <Route path="followers" component={FollowersPage} />
      <Route path="following" component={FollowingPage} />
      <Route path="profile" component={ProfilePage} />
      <Route path="trending" component={TrendingPage} />
      <Route path="*" component={ErrorPage} />
    </Route>
  </Router>
);

export default Routes;
