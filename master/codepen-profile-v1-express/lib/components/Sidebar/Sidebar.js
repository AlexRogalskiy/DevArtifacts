/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

/**
 * Internal dependencies
 */
import Button from '../Button/Button';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import Logo from '../Logo/Logo';
import Nav from '../Nav/Nav';

/**
 * Local variables
 */
const propTypes = {
  changeType: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.number,
};

const defaultProps = {};

/**
 * <Sidebar />
 */
const Sidebar = ({ changeType, name, type }) => (
  <aside className="sidebar">
    <div className="sidebar__top">
      <Link to="/">
        <Logo
          color="#007EE5"
          size={32}
          type={type}
        />
      </Link>
    </div>

    <Link to="/" className="sidebar__header">
      {name}
      <span>beta</span>
    </Link>

    <div className="sidebar__content">
      <Nav type={type} />
    </div>

    <div className="sidebar__footer">
      <ButtonGroup>
        <Button
          block
          className={type === 0 ? 'button--active' : ''}
          onClick={() => changeType(0)}
        >
          <Link to="/pens">CodePen</Link>
        </Button>
        <Button
          block
          className={type === 1 ? 'button--active' : ''}
          onClick={() => changeType(1)}
        >
          <Link to="/shots">Dribbble</Link>
        </Button>
      </ButtonGroup>
    </div>
  </aside>
);

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
