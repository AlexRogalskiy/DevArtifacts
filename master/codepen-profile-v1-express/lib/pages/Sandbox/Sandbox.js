/**
 * External dependencies
 */
import React from 'react';
import Helmet from 'react-helmet';

/**
 * Internal dependencies
 */
import config from '../../../config';
import Button from '../../components/Button/Button';

const Sandbox = () => {
  if (config.env === 'production') {
    return false;
  }

  return (
    <div id="sandbox">
      <Helmet
        title="Sandbox"
      />
      <Button>Button</Button>
      <Button outline>Button</Button>
      <Button primary>Button</Button>
    </div>
  );
};

export default Sandbox;
