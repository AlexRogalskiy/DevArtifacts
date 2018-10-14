import React from 'react';
import PropTypes from 'prop-types';

export default function withHOC2 (Component) {
    return class WithHOC2 extends React.PureComponent {
        render = () => <Component {...this.props} hocValue={'yo!!!'} />;
    };
}