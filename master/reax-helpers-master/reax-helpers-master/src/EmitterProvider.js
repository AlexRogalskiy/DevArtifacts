import React from 'react';
import PropTypes from 'prop-types';
import { EventEmitter } from 'fbemitter';

export default class App extends React.Component {
    static propTypes = {
        children: PropTypes.any,
    };

    static childContextTypes = {
        emitter: PropTypes.object,
    };

    getChildContext = () => {
        return { emitter: this.emitter };
    };

    componentWillMount = () => {
        this.emitter = new EventEmitter();
    };

    render = () => {
        const { children } = this.props;
        return children;
    };
}