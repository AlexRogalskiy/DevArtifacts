import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AnimatedSwitch, AnimatedRoute } from 'react-router-transition';
import { slideLeft, slideRight } from './transitions';
import Helmet from 'react-helmet';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Nav from './Nav';

@withRouter
@withStyles(theme => ({
    txWrapper: {
        position: 'relative',
        width: '100%',
        '& > div': {
            position: 'absolute',
            width: '100%',
        },
    },
}))
@connect((state, props) => ({}))
export default class Layout extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
    };

    render = () => {
        const { children, classes, history, dispatch } = this.props;

        const { action } = history;

        const transition = action === 'PUSH' ? slideLeft : slideRight;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Visitor | React App</title>
                    <link rel={'canonical'} href={'http://mysite.com/example'} />
                    <meta name={'apple-mobile-web-app-title'} content={'CFC'} />
                    <meta name={'application-name'} content={'CFC'} />
                </Helmet>

                <Nav />

                <AnimatedSwitch {...transition} className={classes.txWrapper} runOnMount={false}>
                    {children}
                </AnimatedSwitch>

            </React.Fragment>
        );
    };
}