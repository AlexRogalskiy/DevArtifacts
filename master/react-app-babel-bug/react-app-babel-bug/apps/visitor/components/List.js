import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

@withStyles(theme => ({
    root: {
        ...theme.list,
        backgroundColor: 'red',
    },
}))
@connect((state, props) => ({ }))
export default class List extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
    };

    componentWillMount = () => {
        console.log('mounting list');
    };

    componentWillUnmount = () => {
        console.log('unmounting list');
    };

    go = pathname => () => {
        const { dispatch } = this.props;
        dispatch(push(pathname));
    };

    render = () => {
        const { classes } = this.props;
        const { dispatch } = this.props;

        console.log('rendering list');

        return (
            <Grid container={true} justify={'center'} alignContent={'center'} alignItems={'center'} wrap={'wrap'}>
                <Grid item={true} xs={12}>
                    <h1>List</h1>
                </Grid>

                <Grid item={true} xs={12}>
                    <Button raised={true} onClick={this.go('/')}>move to home</Button>
                </Grid>
            </Grid>
        );
    };
}