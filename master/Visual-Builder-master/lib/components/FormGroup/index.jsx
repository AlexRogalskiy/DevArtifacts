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
 * <FormGroup />
 */
const FormGroup = props => (
  <div className={classNames('form-group', props.className)}>
    {props.children}
  </div>
);

FormGroup.defaultProps = {
  children: undefined,
  className: undefined,
};

FormGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
};

export default FormGroup;
