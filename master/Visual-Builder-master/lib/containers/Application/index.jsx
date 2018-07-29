/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import * as MenuActions from '../../actions';
import Content from '../../components/Content';
import ElementMenu from '../../components/ElementMenu';
import Header from '../../components/Header';

/**
 * <Application />
 */
const Application = props => (
  <div className="app">
    <Header
      pagesMenu={{
        actions: {
          addPage: props.actions.addPage,
          changePage: props.actions.changePage,
          deletePage: props.actions.deletePage,
          toggleMenu: props.actions.togglePagesMenu,
        },
        state: {
          pages: props.pages,
          status: props.pagesMenuStatus,
        },
      }}
      responsiveMenu={{
        actions: {
          changeContentSize: props.actions.changeContentSize,
          decreaseContentSize: props.actions.decreaseContentSize,
          increaseContentSize: props.actions.increaseContentSize,
          toggleMenu: props.actions.toggleResponsiveMenu,
        },
        state: {
          contentSize: props.contentSize,
          status: props.responsiveMenuStatus,
        },
      }}
    />
    <Content elements={props.elements} currentPage={props.currentPage} size={props.size} />
    <ElementMenu
      addElement={props.actions.addElements}
      changeMenu={props.actions.changeElementsMenu}
      status={props.elementsMenuStatus}
      toggleMenu={props.actions.toggleElementsMenu}
      view={props.elementsMenuView}
    />
  </div>
);

Application.propTypes = {
  actions: PropTypes.object.isRequired,
  contentSize: PropTypes.number,
  elements: PropTypes.array.isRequired,
  elementsMenuStatus: PropTypes.bool.isRequired,
  elementsMenuView: PropTypes.number.isRequired,
  pages: PropTypes.array.isRequired,
  pagesMenuStatus: PropTypes.bool.isRequired,
  responsiveMenuStatus: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  contentSize: state.content.size,
  currentPage: state.pages.currentPage,
  elements: state.content.elements,
  elementsMenuStatus: state.menus.elementsMenu,
  elementsMenuView: state.menus.elementsMenuView,
  pages: state.pages.pages,
  pagesMenuStatus: state.menus.pagesMenu,
  responsiveMenuStatus: state.menus.responsiveMenu,
  size: state.content.size,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(MenuActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Application);
