/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import content from './content';
import menus from './menus';
import pages from './pages';

const rootReducer = combineReducers({
  content,
  menus,
  pages,
});

export default rootReducer;
