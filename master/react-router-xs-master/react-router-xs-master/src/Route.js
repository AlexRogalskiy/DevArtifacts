import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from './';

@withRouter
export default class Route extends React.PureComponent {
    static propTypes = {
        router: PropTypes.object.isRequired,
        pathname: PropTypes.string.isRequired,
        component: PropTypes.any.isRequired,
    };

    // componentDidMount = () => console.log('componentDidMount', this.constructor.name);

    // componentWillUnmount = () => console.log('componentWillUnmount', this.constructor.name);

    render = () => {
        const { router, pathname, component } = this.props;

        // console.log('render', this.constructor.name, this.state, this.props);

        const match = router.match(pathname);

        if(match)
            return React.createElement(component, match, true);
        else
            return null;
    };
}