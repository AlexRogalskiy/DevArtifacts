import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash-es';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import sha512 from 'sha512';

import EyeIcon from 'muicons/Eye';
import EyeOffIcon from 'muicons/EyeOff';

import { propTypes } from './propTypes';

export const isHash = value => value && value.match(/^\w{128}$/);

// export const sha512 = async value => {
//     const buffer = new TextEncoder('utf-8').encode(value);
//     const hashBuffer = await (window.crypto.webkitSubtle || window.crypto.subtle).digest('SHA-512', buffer);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
//     return hashHex;
// };

export default class Secret extends React.Component {
    static propTypes = propTypes;

    state = {
        visible: false,
    };

    toggleVisibility = visible => () => {
        this.setState({ visible });
    };

    clear = () => {
        const { onChange } = this.props;
        onChange(null);
    };

    hashOnBlur = async event => {
        const { onChange, onBlur } = this.props;

        const eventOrValue = event;
        if(eventOrValue.target && eventOrValue.target.tagName && eventOrValue.target.tagName.toLowerCase() === 'button')
            return;

        const value = event.target.value;

        if(value && !isHash(value)) {
            const hash = sha512(value).toString('hex');
            onChange(hash);
            onBlur(hash);
        }
        else {
            onBlur(value);
        }
    };

    render = () => {
        const { name, value, onFocus, onChange, onBlur, hashOnBlur } = this.props;
        const { label = name, required, readOnly, disabled, placeholder, helper, computing, clearable, errorRender } = this.props;
        const { controlProps, labelProps, helperProps } = this.props;
        const { visible } = this.state;

        const inputProps = pick(this.props, ['id', 'name', 'autoComplete', 'noValidate', 'required', 'pattern', 'minLength', 'maxLength', 'step', 'min', 'max' ]);

        const errors = errorRender(this.props);

        const computingAdornment = () => (
            <InputAdornment position={'end'} style={{ height: '24px', width: '24px', top: '6px' }}>
                <CircularProgress />
            </InputAdornment>
        );

        const visibilityAdornment = visible => visible ?
            <IconButton onClick={this.toggleVisibility(false)} style={{ height: '24px', width: '24px', top: '6px' }}>
                <EyeOffIcon />
            </IconButton> :
            <IconButton onClick={this.toggleVisibility(true)} style={{ height: '24px', width: '24px', top: '6px' }}>
                <EyeIcon />
            </IconButton>;

        const endAdornment = ((computing, visible) => {
            if(computing)
                return computingAdornment();
            else
                return visibilityAdornment(visible);
        })(computing, visible);

        return (
            <FormControl fullWidth={true} required={!!required} error={!!errors} {...controlProps}>
                { label &&
                <InputLabel htmlFor={name} {...labelProps}>{label}</InputLabel>
                }
                <Input
                    type={visible ? 'text' : 'password'}
                    name={name}
                    value={value || ''}
                    onFocus={onFocus}
                    onChange={onChange}
                    onBlur={hashOnBlur ? this.hashOnBlur : onBlur}
                    disabled={disabled || readOnly}
                    placeholder={placeholder}
                    endAdornment={endAdornment}
                    fullWidth={true}
                    maxLength={20}
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