/**
 * External dependencies
 */
import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

/**
 * <Home />
 */
const Home = () => (
  <div>
    <Helmet
      title="Home"
    />
    Home <Link to="/sandbox">Go To Sandbox</Link>
  </div>
);

export default Home;
