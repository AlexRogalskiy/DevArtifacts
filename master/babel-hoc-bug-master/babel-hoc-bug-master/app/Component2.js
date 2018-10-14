import React from 'react';
import PropTypes from 'prop-types';

import HOC2 from './HOC2';

@HOC2
export default class Component2 extends React.Component {
    static propTypes = {
        greeting: PropTypes.string.isRequired,
        hocValue: PropTypes.string.isRequired,
    };

    render = () => {
        const { greeting, hocValue } = this.props;

        return <p>{greeting} + {hocValue}</p>
    };
}