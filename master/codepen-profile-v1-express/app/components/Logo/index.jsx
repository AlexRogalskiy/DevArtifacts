/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import CodePenLogo from '../../assets/img/logo.svg';

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.number,
  style: PropTypes.object,
  width: PropTypes.number,
};

const defaultProps = {
  color: '#000',
  height: 24,
  style: {},
};

const Logo = (props) => {
  let classes = cx('logo', props.className);

  return (
    <div
      className={classes}
      style={Object.assign({
        width: props.width,
        height: props.height,
        stroke: props.color,
      }, props.style)}
      dangerouslySetInnerHTML={{ __html: CodePenLogo }}
    />
  );
};

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;

export default Logo;
