/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import CardContent from './components/CardContent';
import CardFooter from './components/CardFooter';
import CardFrame from './components/CardFrame';
import CardHeader from './components/CardHeader';
import CardThumbnail from './components/CardThumbnail';

/**
 * Local variables
 */
const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

const defaultProps = {};

const Card = (props) => {
  let classes = cx('card', props.className);

  return (
    <div className={classes} style={props.style}>
      {props.children}
    </div>
  );
};

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

export { Card as default, CardContent, CardFooter, CardFrame, CardHeader, CardThumbnail };
