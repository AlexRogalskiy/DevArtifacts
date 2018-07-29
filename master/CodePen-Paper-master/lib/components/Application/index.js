/**
 * External dependencies
 */
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { __BROWSER__ } from '../../../config';
import HomePage from '../../pages/Home';
import PageHeader from '../PageHeader';
import Tile from '../Tile';
import Sidebar from '../Sidebar';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Local variables
 */
const propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object,
  }),
};

const defaultProps = {
  location: undefined,
};

/**
 * Application Component
 *
 * @since 0.0.1
 */
class Application extends Component {
  componentDidMount() {
    const { location } = this.props;
    console.info('Application mounted');
  }

  _getPageTitle() {
    const { location } = this.props;

    const isPens = location.pathname.substr(0, 5) === '/pens';

    const isPosts = location.pathname.substr(0, 6) === '/posts';

    const isCollections = location.pathname.substr(0, 12) === '/collections';

    if (isPens) {
      return 'Pens';
    } else if (isPosts) {
      return 'Posts';
    } else if (isCollections) {
      return 'Collections';
    }

    return 'Home';
  }

  render() {
    const { location } = this.props;

    return (
      <div className="application">
        <Sidebar location={location} />
        <div className="content">
          <PageHeader title={this._getPageTitle()} />
          <Tile image="//placehold.it/384x225/006EE8/006EE8" title="A Blue Block" type="pen" />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/pens" component={() => <div>Pens</div>} />
            <Route exact path="/posts" component={() => <div>Posts</div>} />
            <Route exact path="/collections" component={() => <div>Collections</div>} />
          </Switch>
        </div>
      </div>
    );
  }
}

Application.propTypes = propTypes;
Application.defaultProps = defaultProps;

export default Application;
