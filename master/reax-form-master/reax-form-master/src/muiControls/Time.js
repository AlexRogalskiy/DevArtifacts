import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash-es';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import Clock from './Clock';

import ClearIcon from 'muicons/Close';

import { propTypes } from './propTypes';

@withStyles(theme => ({
    clock: {
        margin: '16px 0 0 0',
        padding: 0,
    },
}))
export default class Time extends React.Component {
    static propTypes = propTypes;

    clear = () => {
        const { onChange } = this.props;
        onChange(null);
    };

    onChange = value => {
        const { onChange } = this.props;
        onChange(value.format());
    };

    render = () => {
        const { classes, name, value, onFocus, onChange, onBlur } = this.props;
        const { label = name, required, readOnly, disabled, placeholder, helper, computing, clearable, errorRender } = this.props;
        const { multiline, rows, rowsMax } = this.props;
        const { controlProps, labelProps, helperProps } = this.props;

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
            <FormControl fullWidth={true} required={!!required} error={!!errors} {...controlProps}>
                { label &&
                <InputLabel htmlFor={name} {...labelProps} shrink={true}>{label}</InputLabel>
                }
                <Clock className={classes.clock} onChange={this.onChange} explicitOnChange={false} />
                { !errors && helper &&
                <FormHelperText {...helperProps}>{helper}</FormHelperText>
                }
                { errors &&
                <FormHelperText {...helperProps}>{errors}</FormHelperText>
                }
            </FormControl>
        );
    };
}