/**
 * External dependencies
 */
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';


/**
 * Internal dependencies
 */
import { __BROWSER__, __DEVELOPMENT__ } from '../config';
import Application from '../lib/containers/Application';
import reducers from '../lib/reducers';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Local variables
 */
const devTools = __DEVELOPMENT__ ?
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() :
  false;
const preloadedState = window.__PRELOADED_STATE__;

/**
 * Create browser history
 */
const history = createHistory();

/**
 * Build the middleware for intercepting and dispatching navigation actions
 */
const middleware = applyMiddleware(
  routerMiddleware(history),
  thunk,
);

/**
 * Create store
 */
const store = createStore(
  reducers,
  preloadedState,
  compose(
    middleware,
    devTools,
  ),
);

/**
 * Root Component
 *
 * @since 0.0.1
 */
const Root = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Application />
    </ConnectedRouter>
  </Provider>
);

/**
 * Hot module loading
 */
if (module.hot) {
  module.hot.accept();

  module.hot.accept('../lib/reducers', () => {
    const nextRootReducer = require('../lib/reducers/index');

    store.replaceReducer(nextRootReducer);
  });
}

/**
 * Render application
 */
hydrate(<Root />, document.getElementById('root'));
