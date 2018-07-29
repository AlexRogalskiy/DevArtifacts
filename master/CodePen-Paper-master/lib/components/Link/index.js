/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

/**
 * Local variables
 */
const propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  href: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  active: undefined,
  className: undefined,
  href: undefined,
  to: undefined,
  onClick: undefined,
};

/**
 * Link Component
 */
class Link extends Component {
  constructor() {
    super();

    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(event) {
    const { dispatch, onClick, to } = this.props;

    if (!to) {
      return onClick;
    }

    event.preventDefault();

    return dispatch(push(to));
  }

  render() {
    const { active, children, className, href, to } = this.props;

    return (
      <a
        className={className}
        href={href || to}
        onClick={this._handleClick}
      >
        {children}
      </a>
    );
  }
}

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default withRouter(connect()(Link));
