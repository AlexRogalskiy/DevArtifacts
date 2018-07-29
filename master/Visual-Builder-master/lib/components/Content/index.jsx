/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { Motion, presets, spring } from 'react-motion';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * <Content />
 */
class Content extends Component {
  render() {
    console.log(this.props.currentPage);
    const classes = classNames('content', this.props.className);

    return (
      <Motion
        defaultStyle={{
          width: 100,
        }}
        style={{
          width: spring(this.props.size, presets.gentle),
        }}
      >
        {value =>
          <main
            className={classes}
            role="main"
            style={{
              width: `${value.width}%`,
            }}
          >
            Page {this.props.currentPage}
          </main>
        }
      </Motion>
    );
  }
}

Content.defaultProps = {
  className: null,
};

Content.propTypes = {
  className: PropTypes.string,
};

export default Content;
