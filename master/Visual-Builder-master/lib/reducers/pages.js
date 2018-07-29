/**
 * Internal dependencies
 */
import {
  ADD_PAGE,
  CHANGE_PAGE,
  DELETE_PAGE,
} from '../constants/ActionTypes';

/**
 * Initial state
 */
const initialState = {
  currentPage: 0,
  pages: [
    {
      name: 'Page 1',
      id: 0,
      elements: [],
    },
  ],
};

/**
 * pages reducer
 */
function pages(state = initialState, action) {
  switch (action.type) {
    case ADD_PAGE:
      return {
        ...state,
        pages: [
          {
            name: action.name,
            id: state.pages.reduce((maxId, page) => Math.max(page.id, maxId), -1) + 1,
            elements: [],
          },
          ...state.pages,
        ],
      };
    case CHANGE_PAGE:
      return {
        ...state,
        currentPage: action.id,
      };
    case DELETE_PAGE:
      return {
        ...state,
        pages: state.pages.filter(page =>
          page.id !== action.id,
        ),
      };
    default:
      return state;
  }
}

export default pages;
