import React from 'react';
import PropTypes from 'prop-types';

export default function withHOC1 (Component) {
    return class WithHOC1 extends React.PureComponent {
        render = () => <Component {...this.props} />;
    };
}