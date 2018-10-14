import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { cloneDeep, map, without, uniq, difference, range } from 'lodash-es';

import cx from 'classnames';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import keyCode from 'keycode';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import MuiMenu, { MenuList, MenuItem } from 'material-ui/Menu';
import Menu from './menu';
import Clock from './Clock';
import Moment from 'moment-timezone';

import ClearIcon from 'muicons/ContentClear';
import rightActionStyles from './rightActionStyles';

import propTypes from './propTypes';

@withStyles(theme => ({
    ...rightActionStyles,
}))
export default class Time extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        day: PropTypes.instanceOf(Moment),
        format: PropTypes.string,
        interval: PropTypes.number,
        since: PropTypes.any,
        until: PropTypes.any,
    }

    static defaultProps = {
        onChange: () => {},
        day: Moment(),
        format: 'HH:mm',
        interval: 30,
        clearAction: true,
    };

    render () {
        const { onChange, day, format, interval, since, until } = this.props;

        const hours = range(0, 24);
        const minutes = range(0, 60);
        const times = [];
        for(const hour of hours) {
            for(const minute of minutes) {
                if(!minute || !(minute % interval)) {
                    const time = day.clone().set({ hour, minute });
                    //since,until with sameOrBefore/sameOrAfter
                    times.push(time);
                }
            }
        }

        return (
            map(times, (time, index) => (
            <Typography type={'body1'} onClick={() => onChange(time)}>{time.format(format)}</Typography>
            ))
        );
    }
}

export const ClockRender = ({ frame = false, onChange = () => {}, day = Moment(), format = 'HH:mm', interval = 30, since, until }) => {
    const hours = range(0, 24);
    const minutes = range(0, 60);
    const times = [];
    for(const hour of hours) {
        for(const minute of minutes) {
            if(!minute || !(minute % interval)) {
                const time = day.clone().set({ hour, minute });
                //since,until with sameOrBefore/sameOrAfter
                times.push(time);
            }
        }
    }

    if(frame) {
        return (
            <MenuList>
                { map(times, (time, index) => (
                <MenuItem key={index}>
                    <Typography key={time} type={'body1'} onClick={() => onChange(time)}>{time.format(format)}</Typography>
                </MenuItem>
                )) }
            </MenuList>
        );
    }
    else {
        return (
            map(times, (time, index) => (
                <Typography key={time} type={'body1'} onClick={() => onChange(time)}>{time.format(format)}</Typography>
            ))
        );
    }
};
ClockRender.propTypes = {
    frame: PropTypes.bool,
    onChange: PropTypes.func,
    day: PropTypes.instanceOf(Moment),
    format: PropTypes.string,
    interval: PropTypes.number,
    since: PropTypes.any,
    until: PropTypes.any,
};