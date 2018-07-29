/**
 * Internal dependencies
 */
import * as types from '../constants/ActionTypes';

const addElement = element => ({ type: types.ADD_ELEMENT, element });
const deleteElement = element => ({ type: types.ADD_ELEMENT, element });
const changeElementsMenu = view => ({ type: types.CHANGE_ELEMENTS_MENU, view });
const toggleElementsMenu = status => ({ type: types.TOGGLE_ELEMENTS_MENU, status });

const togglePagesMenu = status => ({ type: types.TOGGLE_PAGES_MENU, status });
const toggleResponsiveMenu = status => ({ type: types.TOGGLE_RESPONSIVE_MENU, status });

const decreaseContentSize = () => ({ type: types.DECREASE_CONTENT_SIZE });
const changeContentSize = size => ({ type: types.CHANGE_CONTENT_SIZE, size });
const increaseContentSize = () => ({ type: types.INCREASE_CONTENT_SIZE });

const addPage = () => ({ type: types.ADD_PAGE,
  name: 'New Page',
  elements: [],
});
const changePage = id => ({ type: types.CHANGE_PAGE, id });
const deletePage = id => ({ type: types.DELETE_PAGE, id });

export {
  addElement,
  addPage,
  changeContentSize,
  changeElementsMenu,
  changePage,
  decreaseContentSize,
  deleteElement,
  deletePage,
  increaseContentSize,
  toggleElementsMenu,
  togglePagesMenu,
  toggleResponsiveMenu,
};
