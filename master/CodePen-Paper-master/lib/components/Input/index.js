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
import PseudoClassComponent from '../PseudoClassComponent';

/**
 * Stylesheet
 */
if (__BROWSER__) require('./style.scss');

/**
 * Input Component
 *
 * @since 0.0.1
 */
class Input extends PseudoClassComponent {
  constructor() {
    super();

    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
  }

  _onFocus() {
    const { onFocus } = this.props;

    if (onFocus) {
      onFocus();
    }

    this._handleFocus();
  }

  _onBlur() {
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur();
    }

    this._handleBlur();
  }

  render() {
    const { className, placeholder, type } = this.props;

    const { focused } = this.state;

    const classes = classNames({
      'input': true,
      'is-focused': focused,
    }, className);

    return (
      <input
        className={classes}
        onBlur={this._onBlur}
        onFocus={this._onFocus}
        placeholder={placeholder}
        type={type}
      />
    );
  }
}

export default Input;
