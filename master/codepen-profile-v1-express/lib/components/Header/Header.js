/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { includes } from 'lodash';

/**
 * Internal dependencies
 */
import { capitalizeFirstLetter } from '../../helpers';
import Button from '../Button/Button';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import Tabs from '../Tabs/Tabs';

/**
 * Lcoal variables
 */
const propTypes = {
  params: PropTypes.object,
};

const defaultProps = {};

/**
 * <Header />
 */
const Header = ({ params }) => (
  <header className="header">
    <div className="header__top">
      <h1 className="header__title">{params.view ? capitalizeFirstLetter(params.view) : false}</h1>
      <div className="header__content">
        test
      </div>
    </div>
    <div className="header__bottom">
      {includes(['collections', 'pens', 'posts'], params.view) ? <Tabs params={params} /> : false}
    </div>
    <ButtonGroup
      style={{
        position: 'absolute',
        right: '40px',
        top: '136px',
        width: '198px',
      }}
      vertical
    >
      <Button block primary>Button</Button>
      <Button block primary>Button</Button>
    </ButtonGroup>
  </header>
);

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
