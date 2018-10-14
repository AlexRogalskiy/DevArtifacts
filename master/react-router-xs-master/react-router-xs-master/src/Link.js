import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from './';

@withRouter
export default class Link extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        router: PropTypes.object.isRequired,
        pathname: PropTypes.string.isRequired,
        currentClassName: PropTypes.string,
        className: PropTypes.string,
    };

    // componentDidMount = () => console.log('componentDidMount', this.constructor.name);

    // componentWillUnmount = () => console.log('componentWillUnmount', this.constructor.name);

    render = () => {
        const { children, router, pathname, currentClassName, className, ...otherProps } = this.props;

        // console.log('render', this.constructor.name, this.state, this.props);

        const match = router.match(pathname);
        const basedPathname = router.getBasedPathname(pathname);

        let computedClassName = className || '';
        computedClassName += match ? ` ${currentClassName}` : '';
        computedClassName = computedClassName.trim();

        return (
            <a {...otherProps} onClick={router.redirect(pathname)} href={basedPathname} className={computedClassName}>{children}</a>
        );
    };
}