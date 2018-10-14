import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, map, without, uniq, difference, range } from 'lodash-es';
import moment from 'moment-timezone';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';

import DoneIcon from 'muicons/Check';

import propTypes from './propTypes';

@withStyles(theme => ({
    root: {
        '& *': {
            alignContent: 'center',
            alignItems: 'center',
        },
    },
    showSpinners: {
        '& ::-webkit-inner-spin-button, & ::-webkit-outer-spin-button': {
            opacity: 1,
        },
    },
    hours: {
        extend: 'showSpinners',
    },
    minutes: {
        extend: 'showSpinners',
    },
}))
export default class Clock extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        className: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        day: PropTypes.instanceOf(moment),
        explicitOnChange: PropTypes.bool,
    };

    static defaultProps = {
        day: moment(),
        explicitOnChange: false,
    };

    state = {
        momt: moment(),
    };

    componentWillMount = () => {
        const { day } = this.props;

        day.set({ seconds: 0, milliseconds: 0 });

        this.setState({ momt: day });
    };

    setHour = event => {
        const { onChange, explicitOnChange } = this.props;
        const { momt } = this.state;
        const { value } = event.target;
        momt.set({ hours: value });
        if(!explicitOnChange)
            onChange(momt);
    };

    setMinute = event => {
        const { onChange, explicitOnChange } = this.props;
        const { momt } = this.state;
        const { value } = event.target;
        momt.set({ minutes: value });
        if(!explicitOnChange)
            onChange(momt);
    };

    onChange = () => {
        const { onChange } = this.props;
        const { momt } = this.state;
        onChange(momt);
    };

    render () {
        const { classes, className, explicitOnChange } = this.props;
        const { momt } = this.state;
        const inputProps = { length: 2, minLength: 1, maxLength: 2, min: 0, step: 1 };

        return (
            <Grid className={cx(className, classes.root)} container={true} justify={'flex-start'} alignContent={'center'} alignItems={'center'}>
                <Input className={classes.hours} type={'number'} inputProps={{ ...inputProps, max: 24 }} onChange={this.setHour} />
                <span>:</span>
                <Input className={classes.minutes} type={'number'} inputProps={{ ...inputProps, max: 60 }} onChange={this.setMinute} />
                { explicitOnChange &&
                <IconButton onClick={this.onChange}>
                    <DoneIcon />
                </IconButton>
                }
            </Grid>
        );
    }
}