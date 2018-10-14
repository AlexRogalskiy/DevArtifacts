import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom'
import { push } from 'react-router-redux';

import { withStyles } from 'material-ui/styles';
import cx from 'classnames';

import { name } from '../../../package';

@withRouter
@withStyles(theme => ({
    root: {
        ...theme.nav,
    },
    li: {
        display: 'inline-block',
        padding: '20px',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    selectedLi: {
        backgroundColor: 'blue',
    },
}))
export default class Nav extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    render = () => {
        const { classes } = this.props;

        return (
            <ul className={cx(classes.root)}>
                <NavLink to={'/'} activeClassName={classes.selectedLi} exact={true} strict={true}>
                    <li className={cx(classes.li)}>{name} - home</li>
                </NavLink>
                <NavLink to={'/list'} activeClassName={classes.selectedLi} exact={true} strict={true}>
                    <li className={cx(classes.li)}>{name} - list</li>
                </NavLink>
            </ul>
        );
    }
}