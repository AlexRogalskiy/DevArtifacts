/**
 * Internal dependencies
 */
import {
  CHANGE_ELEMENTS_MENU,
  TOGGLE_ELEMENTS_MENU,
  TOGGLE_PAGES_MENU,
  TOGGLE_RESPONSIVE_MENU,
} from '../constants/ActionTypes';

/**
 * Initial state
 */
const initialState = {
  elementsMenu: false,
  elementsMenuView: 0,
  pagesMenu: false,
  responsiveMenu: false,
};

/**
 * pages reducer
 */
function pages(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ELEMENTS_MENU:
      return {
        ...state,
        elementsMenuView: action.view,
      };
    case TOGGLE_ELEMENTS_MENU:
      return {
        ...state,
        elementsMenu: !state.elementsMenu,
        elementsMenuView: 0,
        pagesMenu: false,
        responsiveMenu: false,
      };
    case TOGGLE_PAGES_MENU:
      return {
        ...state,
        elementsMenu: false,
        pagesMenu: !state.pagesMenu,
        responsiveMenu: false,
      };
    case TOGGLE_RESPONSIVE_MENU:
      return {
        ...state,
        elementsMenu: false,
        pagesMenu: false,
        responsiveMenu: !state.responsiveMenu,
      };
    default:
      return state;
  }
}

export default pages;
