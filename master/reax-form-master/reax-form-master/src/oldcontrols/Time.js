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
import Menu from './menu';
import { ClockRender } from './Clock';
import Moment from 'moment-timezone';

import ClearIcon from 'muicons/ContentClear';
import rightActionStyles from './rightActionStyles';

import propTypes from './propTypes';

@withStyles(theme => ({
    ...rightActionStyles,
}))
export default class Time extends React.Component {
    static propTypes = {
        ...propTypes,
        day: PropTypes.instanceOf(Moment),
        format: PropTypes.string,
        interval: PropTypes.number,
        since: PropTypes.any,
        until: PropTypes.any,
        clearAction: PropTypes.bool,
    }

    static defaultProps = {
        day: Moment(),
        format: 'HH:mm',
        interval: 30,
        clearAction: true,
    };

    render () {
        const { day, format, interval, since, until } = this.props;
        const { classes, elementRef, onChange, onBlur, name, value, values, disabled, valid, validations, pristine, blurred, readOnly, required, pattern, minLength, maxLength, placeholder, description } = this.props;
        const { displayName, clearAction, errorRender } = this.props;
        const proxiedChange = value => {
            const timestamp = value ? value.format('X') : null;
            onChange(timestamp);
        };
        const proxiedBlur = () => onBlur(value);

        const currentTime = value ? Moment.unix(value) : null;
        const formattedValue = currentTime ? currentTime.format(format) : '';

        const errors = errorRender(this.props);

        return (
            <FormControl fullWidth={true} required={!!required} error={!!errors}>
                <InputLabel htmlFor={name}>{displayName || name}</InputLabel>
                <Input
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
                <Menu anchorId={name}>
                    { ClockRender({ day, format, interval, since, until, onChange: proxiedChange }) }
                    {/*<Clock day={day} format={format} interval={interval} since={since} until={until} onChange={proxiedChange} />*/}
                </Menu>
                { clearAction && <IconButton className={classes.action} onClick={() => proxiedChange(null)}><ClearIcon /></IconButton>}
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