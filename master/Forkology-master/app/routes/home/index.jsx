/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Logo from '../../components/logo';
import Button from '../../components/button';

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
};

const defaultProps = {};

const Home = (props) => {
  let classes = classNames({
    page: true,
    'page--home': true,
  }, props.className);

  return (
    <div className={classes}>
      Home
      <Logo />
      <Button type="button" round>Button</Button>
    </div>
  );
};

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;
