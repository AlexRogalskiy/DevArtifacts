/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { IndexRoute, Redirect, Route } from 'react-router';

/**
 * Internal dependencies
 */
import config from '../../config';
import App from '../containers/App/App';
import Home from '../pages/Home/Home';
import Sandbox from '../pages/Sandbox/Sandbox';

/**
 * Temp Components
 */
const Showcase = ({ params }) => <div>{params.id}</div>;
Showcase.propTypes = {
  params: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

const Public = ({ params }) => <div>{params.id}</div>;
Public.propTypes = {
  params: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

const Popular = ({ params }) => <div>{params.id}</div>;
Popular.propTypes = {
  params: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

const Loved = ({ params }) => <div>{params.id}</div>;
Loved.propTypes = {
  params: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

const Forked = ({ params }) => <div>{params.id}</div>;
Forked.propTypes = {
  params: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

const Shots = () => <div>Shots</div>;
Shots.propTypes = {
  params: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

const Projects = () => <div>Projects</div>;

/**
 * Routes
 */
const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path=":view">
      <IndexRoute component={Showcase} />
      <Route path="public" component={Public} />
      <Route path="popular" component={Popular} />
      <Route path="loved" component={Loved} />
      <Route path="forked" component={Forked} />
    </Route>
    <Route path="projects" component={Projects} />
    <Route path="shots" component={Shots} />
    {config.env === 'development' ? <Route path="sandbox" component={Sandbox} /> : false}
    <Redirect from="*" to="/" />
    <Redirect from="/" to="/pens" />
  </Route>
);

export default routes;
