import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withEmitter } from 'reax-helpers';
import * as actions from '../../store/actions';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

@withStyles(theme => ({
    bold: {
        fontWeight: 'bold',
    },
}))
@withEmitter()
@connect((state, props) => ({ }))
export default class Home extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        emitter: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    componentWillMount = () => {
        console.log('mounting home');
    };

    componentWillUnmount = () => {
        console.log('unmounting home');
    };

    action = () => {
        const { dispatch } = this.props;
        dispatch(actions.set('key', 'value'));
    };

    go = pathname => () => {
        const { dispatch } = this.props;
        dispatch(push(pathname));
    };

    render = () => {
        const { classes, emitter } = this.props;

        console.log('rendering home');

        return (
            <Grid container={true} justify={'center'} alignContent={'center'} alignItems={'center'} wrap={'wrap'}>
                <Grid item={true} xs={12}>
                    <h1>Home</h1>
                </Grid>
                <Grid item={true} xs={12}>
                    <h2 className={cx(classes.bold)}>Lorem Ipsum Dolor Amet</h2>
                </Grid>
                <Grid item={true} xs={12}>
                    <Button raised={true} onClick={this.action}>Action</Button>
                </Grid>
                <Grid item={true} xs={12}>
                    <Button raised={true} onClick={this.go('/list')}>Move to list</Button>
                </Grid>
                <Grid item={true} xs={12}>
                    <img src={'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Big_Bear_Valley%2C_California.jpg/1200px-Big_Bear_Valley%2C_California.jpg'} />
                </Grid>
            </Grid>
        );
    };
}
