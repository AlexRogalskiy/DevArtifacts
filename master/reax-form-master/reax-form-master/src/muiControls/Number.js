import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash-es';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';

import ClearIcon from 'muicons/Close';

import { propTypes } from './propTypes';

export default class Text extends React.Component {
    static propTypes = propTypes;

    clear = () => {
        const { onChange } = this.props;
        onChange(null);
    };

    render = () => {
        const { name, value, onFocus, onChange, onBlur } = this.props;
        const { label = name, required, readOnly, disabled, placeholder, helper, computing, clearable, errorRender } = this.props;
        const { controlProps, labelProps, helperProps } = this.props;

        const inputProps = pick(this.props, ['id', 'name', 'autoComplete', 'noValidate', 'required', 'pattern', 'minLength', 'maxLength', 'step', 'min', 'max' ]);

        const errors = errorRender(this.props);

        const computingAdornment = () => (
            <InputAdornment position={'end'}>
                <CircularProgress />
            </InputAdornment>
        );

        const clearAdornment = () => (
            <InputAdornment position={'end'}>
                <IconButton onClick={this.clear}>
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

        const castedValue = value !== undefined && value !== null && !Number.isNaN(value) ? value : '';

        return (
            <FormControl fullWidth={true} required={!!required} error={!!errors} {...controlProps}>
                { label &&
                <InputLabel htmlFor={name} {...labelProps}>{label}</InputLabel>
                }
                <Input
                    type={'number'}
                    name={name}
                    value={castedValue}
                    onFocus={onFocus}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled || readOnly}
                    placeholder={placeholder}
                    endAdornment={endAdornment}
                    fullWidth={true}
                    inputProps={inputProps}
                />
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