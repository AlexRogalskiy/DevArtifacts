/**
 * External dependencies
 */
import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

/**
 * Root Reducers
 */
const rootReducers = combineReducers({
  router: routerReducer,
});

export default rootReducers;
