/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
};

const defaultProps = {
  src: 'http://codepen.io',
};

/**
 * <CardFrame />
 */
const CardFrame = (props) => {
  let classes = cx('card__frame', props.className);

  return (
    <div className={classes}>
      <iframe src={props.src} />
    </div>
  );
};

CardFrame.propTypes = propTypes;
CardFrame.defaultProps = defaultProps;

export default CardFrame;
