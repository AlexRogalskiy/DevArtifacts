/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import ThumbnailImage from '../../../../assets/img/placeholder.png';

/**
 * Local variables
 */
const propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
};

const defaultProps = {
  alt: 'Card Thumbnail',
  src: ThumbnailImage,
};

/**
 * <CardThumbnail />
 */
const CardThumbnail = (props) => {
  let classes = cx('card__thumbnail', props.className);

  return (
    <div className={classes}>
      <img src={props.src} alt={props.title} />
    </div>
  );
};

CardThumbnail.propTypes = propTypes;
CardThumbnail.defaultProps = defaultProps;

export default CardThumbnail;
