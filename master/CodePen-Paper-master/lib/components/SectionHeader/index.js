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
  label: PropTypes.string.isRequired,
};

const defaultProps = {
  className: null,
  label: null,
};

/**
 * Section Header Component
 *
 * @since 0.0.1
 */
const SectionHeader = ({ className, label }) => {
  const classes = classNames('section-header', className);

  return <h2 className={classes}>{label}</h2>;
};

SectionHeader.propTypes = propTypes;
SectionHeader.defaultProps = defaultProps;

export default SectionHeader;
