import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

export default class App extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        store: PropTypes.object.isRequired,
    };

    render = () => {
        const { children, store } = this.props;

        return (
            <Provider store={store}>{children}</Provider>
        );
    };
}
