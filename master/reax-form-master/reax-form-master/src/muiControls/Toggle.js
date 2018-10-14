import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash-es';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Switch from 'material-ui/Switch';
import Checkbox from 'material-ui/Checkbox';

import { propTypes } from './propTypes';

@withStyles(theme => ({
}))
export default class Toggle extends React.Component {
    static propTypes = {
        ...propTypes,
        type: PropTypes.oneOf(['switch', 'checkbox']),
        bool: PropTypes.bool
    };

    static defaultProps = {
        bool: true,
        type: 'switch',
    };

    onChange = (event, checked) => {
        const { bool, onChange } = this.props;

        const value = bool ? !!checked : (checked ? 'yes' : 'no');
        onChange(value);
    };

    render = () => {
        const { classes } = this.props;
        const { name, value, onFocus, onChange, onBlur } = this.props;
        const { label = name, required, readOnly, disabled, placeholder, helper, computing, clearable, errorRender } = this.props;
        const { type, bool } = this.props;
        const { controlProps, labelProps, helperProps } = this.props;

        const errors = errorRender(this.props);

        const ToggleType = type === 'switch' ? Switch : Checkbox;
        const checkedValue = bool ? !!value : value === 'yes';

        return (
            <FormControl fullWidth={true} required={!!required} error={!!errors} {...controlProps}>
                { label &&
                <InputLabel htmlFor={name} {...labelProps}>{label}</InputLabel>
                }
                <ToggleType
                    checked={checkedValue}
                    onFocus={onFocus}
                    onChange={this.onChange}
                    onBlur={onBlur}
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