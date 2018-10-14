import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash-es';
import keycode from 'keycode';
import moment from 'moment-timezone';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';

import Popover from 'material-ui/Popover';
import Calendar from './Calendar';
import Clock from './Clock';

import ClearIcon from 'muicons/Close';

import { propTypes } from './propTypes';

@withStyles(theme => ({
}))
export default class Datetime extends React.Component {
    static propTypes = propTypes;

    state = {
        showDate: false,
        showTime: false,
        time: null,
    };

    showDate = showDate => () => this.setState({ showDate });
    showTime = showTime => () => this.setState({ showTime });

    clear = () => {
        const { onChange } = this.props;
        onChange(null);
    };

    onDateChange = value => {
        this.setState({ showDate: false, showTime: true, time: value });
    };

    onTimeChange = value => {
        const { onChange } = this.props;
        onChange(value.format());
        this.setState({ showDate: false, showTime: false, time: null });
    };

    onKeyUp = event => {
        const key = keycode(event);
        if(!['tab', 'shift'].includes(key))
            this.showDate(true)();
    };

    render = () => {
        const { name, value, onFocus, onChange, onBlur } = this.props;
        const { label = name, required, readOnly, disabled, placeholder, helper, computing, clearable, errorRender } = this.props;
        const { multiline, rows, rowsMax } = this.props;
        const { controlProps, labelProps, helperProps } = this.props;
        const { format } = this.props;
        const { showDate, showTime, time } = this.state;

        const inputProps = pick(this.props, ['id', 'name', 'autoComplete', 'noValidate', 'required', 'pattern', 'minLength', 'maxLength', 'step', 'min', 'max' ]);

        const errors = errorRender(this.props);

        const computingAdornment = () => (
            <InputAdornment position={'end'} style={{ height: '24px', width: '24px', top: '6px' }}>
                <CircularProgress />
            </InputAdornment>
        );

        const clearAdornment = () => (
            <InputAdornment position={'end'}>
                <IconButton onClick={this.clear} style={{ height: '24px', width: '24px', top: '6px' }}>
                    <ClearIcon />
                </IconButton>
            </InputAdornment>
        );

        const endAdornment = ((computing, clearable) => {
            if(computing)
                return computingAdornment();
            else if(clearable)
                return clearAdornment();
            else
                return null;
        })(computing, clearable);

        return (
            <React.Fragment>
                <FormControl fullWidth={true} required={!!required} error={!!errors} {...controlProps}>
                    { label &&
                    <InputLabel htmlFor={name} {...labelProps}>{label}</InputLabel>
                    }
                    <Input
                        inputRef={ref => this.inputRef = ref}
                        type={'text'}
                        name={name}
                        value={value ? moment(value).format(format) : ''}
                        onClick={!readOnly ? this.showDate(true) : Function.prototype}
                        onKeyUp={!readOnly ? this.onKeyUp : Function.prototype}
                        disabled={disabled || readOnly}
                        placeholder={placeholder}
                        endAdornment={endAdornment}
                        fullWidth={true}
                        multiline={multiline}
                        rows={rows}
                        rowsMax={rowsMax}
                        inputProps={inputProps}
                    />
                    { !errors && helper &&
                    <FormHelperText {...helperProps}>{helper}</FormHelperText>
                    }
                    { errors &&
                    <FormHelperText {...helperProps}>{errors}</FormHelperText>
                    }
                </FormControl>
                <Popover id={'popover'} anchorEl={this.inputRef} open={showDate} onClose={this.showDate(false)}>
                    <Calendar onChange={this.onDateChange} />
                </Popover>
                <Popover open={showTime} anchorEl={this.inputRef}>
                    <Clock day={time} onChange={this.onTimeChange} explicitOnChange={true} />
                </Popover>
            </React.Fragment>
        );
    };
}