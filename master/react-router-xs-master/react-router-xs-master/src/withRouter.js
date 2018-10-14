import React from 'react';

import { Consumer } from './Router';

export default function withRouter (Component) {
    return class WithRouter extends React.PureComponent {
        render = () => {
            return (
                <Consumer>
                    {context => <Component {...this.props} router={context} />}
                </Consumer>
            );
        };
    };
}