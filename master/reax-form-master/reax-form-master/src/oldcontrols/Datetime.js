import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { cloneDeep, map, without, uniq, difference } from 'lodash-es';
import cx from 'classnames';
import keyCode from 'keycode';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Calendar from './Calendar';
import { ClockRender } from './Clock';
import Menu from 'material-ui/Menu';
import Moment from 'moment-timezone';

import ClearIcon from 'muicons/ContentClear';
import rightActionStyles from './rightActionStyles';

import propTypes from './propTypes';

@withStyles(theme => ({
    ...rightActionStyles,
    menu: {
        '& > *': {
            padding: 0
        },
    },
}))
export default class Date extends React.Component {
    static propTypes = {
        ...propTypes,
        locale: PropTypes.string,
        format: PropTypes.string,
        timeFormat: PropTypes.string,
        clearAction: PropTypes.bool,
    };

    static defaultProps = {
        format: '',
        timeFormat: 'HH:mm',
        clearAction: true,
    };

    state = {
        moment: Moment(),
        open: false,
        clockOpen: false,
    };

    @autobind
    openCalendar () {
        const { disabled } = this.props;

        if(!disabled)
            this.setState({ open: true });
    }

    @autobind
    closeCalendar () {
        this.setState({ open: false });
    }

    @autobind
    openClock () {
        this.setState({ clockOpen: true });
    }

    @autobind
    closeClock () {
        this.setState({ clockOpen: false });
    }

    @autobind
    setDay (value) {
        const { moment } = this.state;
        for(let prop of ['date', 'month', 'year'])
            moment.set({ [prop]: value.get(prop) });
        this.setState({ moment });

        this.closeCalendar();
        this.openClock();
    }

    @autobind
    setTime (value) {
        console.log('setTime', value);
        const { onChange } = this.props;
        const { moment } = this.state;
        for(let prop of ['second', 'minute', 'hour'])
            moment.set({ [prop]: value.get(prop) });
        this.setState({ moment });

        this.closeClock();

        const timestamp = moment.format('X');
        onChange(timestamp);
    }

    render () {
        const { locale, weekStartOnSunday, availableYears } = this.props;
        const { day, interval, since, until } = this.props;
        const { format, timeFormat } = this.props;
        const { classes, elementRef, onChange, onBlur, name, value, values, disabled, valid, validations, pristine, blurred, readOnly, required, pattern, minLength, maxLength, placeholder, description } = this.props;
        const { displayName, clearAction, errorRender } = this.props;
        const proxiedBlur = () => onBlur(value);

        const currentDate = value ? Moment.unix(value) : null;
        const formattedValue = currentDate ? currentDate.format(format) : '';

        const errors = errorRender(this.props);

        return (
            <FormControl fullWidth={true} required={!!required} error={!!errors}>
                <InputLabel htmlFor={name}>{displayName || name}</InputLabel>
                <Input
                    inputRef={ref => this.setState({ anchorEl: ref })}
                    type={'text'}
                    id={name}
                    placeholder={placeholder}
                    value={formattedValue}
                    minLength={minLength}
                    maxLength={maxLength}
                    onClick={this.openCalendar}
                    onKeyUp={this.openCalendar}
                    onBlur={proxiedBlur}
                    disabled={disabled}
                    inputProps={{ readOnly: true }}
                />
                <Menu className={classes.menu} anchorEl={this.state.anchorEl} open={this.state.open} onRequestClose={this.closeCalendar} ref={elementRef} name={name}>
                    <Calendar locale={locale} weekStartOnSunday={weekStartOnSunday} onChange={this.setDay} currentDate={currentDate} availableYears={availableYears} />
                </Menu>
                <Menu className={classes.menu} anchorEl={this.state.anchorEl} open={this.state.clockOpen} onRequestClose={this.closeClock} ref={elementRef} name={name}>
                    { ClockRender({ frame: true, day, format: timeFormat, interval, since, until, onChange: this.setTime }) }
                </Menu>
                { clearAction && <IconButton className={classes.action} onClick={() => onChange(null)}><ClearIcon /></IconButton>}
                { !errors && description &&
                <FormHelperText>{description}</FormHelperText>
                }
                { errors &&
                <FormHelperText>{errors}</FormHelperText>
                }
            </FormControl>
        );
    }
}