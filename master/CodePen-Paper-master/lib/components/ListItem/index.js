/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { __BROWSER__ } from '../../../config';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Local variables
 */
const propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  leftColumn: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  rightColumn: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const defaultProps = {
  className: null,
  children: null,
  leftColumn: null,
  rightColumn: null,
};

/**
 * List Item Component
 *
 * @since 0.0.1
 */
const ListItem = ({
  children,
  className,
  heading,
  leftColumn,
  onClick,
  rightColumn,
  subHeading,
}) => {
  const classes = classNames({
    'list-item': true,
    'is-link': onClick,
  }, className);

  return (
    <div className={classes} onClick={onClick}>
      {leftColumn ? (
        <div className="list-item__left-column">{leftColumn}</div>
      ) : false}

      <div className="list-item__content">
        {heading ? (
          <h3 className="list-item__heading">{heading}</h3>
        ) : false}

        {subHeading ? (
          <div className="list-item__sub-heading">{subHeading}</div>
        ) : false}

        {children}
      </div>

      {leftColumn ? (
        <div className="list-item__right-column">{rightColumn}</div>
      ) : false}
    </div>
  );
}

ListItem.propTypes = propTypes;
ListItem.defaultProps = defaultProps;

export default ListItem;
