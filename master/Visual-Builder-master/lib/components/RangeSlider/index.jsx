/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * <RangeSlider />
 */
class RangeSlider extends Component {
  constructor() {
    super();

    this._onChange = this._onChange.bind(this);
  }

  _onChange(event) {
    this.props.onChange(parseInt(event.target.value, 10));
  }

  render() {
    const classes = classNames('range-slider', this.props.className);

    return (
      <input
        className={classes}
        defaultValue={this.props.defaultValue}
        id={this.props.id}
        list={this.props.list}
        onChange={this._onChange}
        max={this.props.max}
        min={this.props.min}
        step={this.props.step}
        style={this.props.style}
        type="range"
        value={this.props.value}
      />
    );
  }
}

export default RangeSlider;
