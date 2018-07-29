/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { __BROWSER__ } from '../../../config';
import Link from '../Link';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Tile Component
 *
 * @since 0.0.1
 */
const Tile = ({ className, id, image, title, type}) => {
  const classes = classNames('tile', className);

  return (
    <Link className={classes} to={`/${type}/${id}`}>
      <div className="tile__thumbnail">
        <img src={image} alt={title} />
      </div>
      <h3 className="tile__label">{title}</h3>
    </Link>
  );
}

export default Tile;
