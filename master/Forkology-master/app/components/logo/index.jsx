/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};

const defaultProps = {
  background: '#3498DB',
  color: '#FFF',
  size: '56',
};

/**
 * <Logo />
 */
const Logo = (props) => {
  let classes = classNames({
    logo: true,
  }, props.className);

  let styles = {
    background: props.background,
    width: `${props.size}px`,
    height: `${props.size}px`,
  };

  return (
    <div
      className={classes}
      style={styles}
    >
      <svg
        viewBox="0 0 174 174"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M86.4 90.65l57.8-57.8M62.7 164.3L163.2 63.8M39.4
            87.65l74.35-74.4m-82 132l27.65-27.6m-47.2-2.8l.2-.2m100.6
            49.4l-.6-.4M65 11v1M11 66.05L40.05 37m109.35 90.65l13.55-13.55"
          stroke={props.color}
          strokeWidth="20"
          fill="none"
          fill-rule="evenodd"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;

export default Logo;
