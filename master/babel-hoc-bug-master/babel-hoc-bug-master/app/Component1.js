import React from 'react';
import PropTypes from 'prop-types';

import HOC1 from './HOC1';

@HOC1
export default class Component1 extends React.Component {
    static propTypes = {
        greeting: PropTypes.string.isRequired,
    };

    render = () => {
        const { greeting } = this.props;

        return <p>{greeting}</p>
    };
}