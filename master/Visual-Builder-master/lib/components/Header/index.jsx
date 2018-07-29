/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import Button from '../Button';
import PagesMenu from '../PagesMenu';
import ResponsiveMenu from '../ResponsiveMenu';

/**
 * <Header />
 */
class Header extends Component {
  render() {
    const classes = classNames('header', this.props.className);

    return (
      <header className={classes} role="banner">
        <div className="header__group">
          <PagesMenu
            addPage={this.props.pagesMenu.actions.addPage}
            changePage={this.props.pagesMenu.actions.changePage}
            deletePage={this.props.pagesMenu.actions.deletePage}
            pages={this.props.pagesMenu.state.pages}
            toggleMenu={this.props.pagesMenu.actions.toggleMenu}
            status={this.props.pagesMenu.state.status}
          />
          <ResponsiveMenu
            changeContentSize={this.props.responsiveMenu.actions.changeContentSize}
            contentSize={this.props.responsiveMenu.state.contentSize}
            decreaseContentSize={this.props.responsiveMenu.actions.decreaseContentSize}
            increaseContentSize={this.props.responsiveMenu.actions.increaseContentSize}
            toggleMenu={this.props.responsiveMenu.actions.toggleMenu}
            status={this.props.responsiveMenu.state.status}
          />
        </div>
        <div className="header__group">
          <Button>
            <span className="ion ion-ios-cloud-download" />
          </Button>
          <Button>
            <span className="ion ion-gear-a" />
          </Button>
        </div>
      </header>
    );
  }
}

export default Header;
