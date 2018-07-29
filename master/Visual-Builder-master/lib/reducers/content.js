/**
 * Internal dependencies
 */
import {
  ADD_ELEMENT,
  CHANGE_CONTENT_SIZE,
  DECREASE_CONTENT_SIZE,
  DELETE_ELEMENT,
  INCREASE_CONTENT_SIZE,
} from '../constants/ActionTypes';

/**
 * Initial state
 */
const initialState = {
  elements: [],
  size: 100,
};

/**
 * content reducer
 */
function content(state = initialState, action) {
  switch (action.type) {
    case ADD_ELEMENT:
      return {
        ...state,
      };
    case CHANGE_CONTENT_SIZE:
      return {
        ...state,
        size: action.size,
      };
    case DECREASE_CONTENT_SIZE:
      return {
        ...state,
        size: state.size - 1,
      };
    case DELETE_ELEMENT:
      return {
        ...state,
      };
    case INCREASE_CONTENT_SIZE:
      return {
        ...state,
        size: state.size + 1,
      };
    default:
      return state;
  }
}

export default content;
