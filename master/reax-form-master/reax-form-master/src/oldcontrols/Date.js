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
import Menu from 'material-ui/Menu';
import moment from 'moment-timezone';

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
        clearAction: PropTypes.bool,
    }

    static defaultProps = {
        format: '',
        clearAction: true,
    };

    componentWillMount () {
        this.setState({ open: false });
    }

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

    render () {
        const { locale, format, weekStartOnSunday, availableYears } = this.props;
        const { classes, elementRef, onChange, onBlur, name, value, values, disabled, valid, validations, pristine, blurred, readOnly, required, pattern, minLength, maxLength, placeholder, description } = this.props;
        const { displayName, clearAction, errorRender } = this.props;
        const proxiedChange = value => {
            const timestamp = value.format('X');
            onChange(timestamp);
            this.closeCalendar();
        }
        const proxiedBlur = () => onBlur(value);

        const currentDate = value ? moment.unix(value) : null;
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
                    <Calendar locale={locale} weekStartOnSunday={weekStartOnSunday} onChange={proxiedChange} currentDate={currentDate} availableYears={availableYears} />
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