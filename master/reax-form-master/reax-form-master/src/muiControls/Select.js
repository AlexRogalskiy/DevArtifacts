import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { pick, map } from 'lodash-es';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';

import MuiSelect from 'material-ui/Select';
import { MenuList, MenuItem } from 'material-ui/Menu';

import ClearIcon from 'muicons/Close';

import { propTypesWithValues as propTypes } from './propTypes';

@withStyles(theme => ({
    hideMoreIcon: {
        display: 'none',
    },
}))
export default class Select extends React.Component {
    static propTypes = propTypes;

    clear = () => {
        const { onChange } = this.props;
        onChange(null);
    };

    onFocus = event => {
        const { onFocus } = this.props;
        const value = ReactDOM.findDOMNode(this).getElementsByTagName('input')[0].value; //eslint-disable-line
        onFocus(value);
    };

    onBlur = event => {
        const { onBlur } = this.props;
        const value = ReactDOM.findDOMNode(this).getElementsByTagName('input')[0].value; //eslint-disable-line
        onBlur(value);
    };

    render = () => {
        const { classes } = this.props;
        const { multiple, name, value, values, onFocus, onChange, onBlur } = this.props;
        const { label = name, required, readOnly, disabled, placeholder, helper, computing, clearable, errorRender } = this.props;
        const { multiline, rows, rowsMax } = this.props;
        const { controlProps, labelProps, helperProps } = this.props;

        const inputProps = pick(this.props, ['id', 'name', 'autoComplete', 'noValidate', 'required', 'pattern', 'minLength', 'maxLength', 'step', 'min', 'max' ]);

        const errors = errorRender(this.props);

        const computingAdornment = () => (
            <InputAdornment position={'end'}>
                <CircularProgress />
            </InputAdornment>
        );

        const computedEndAdornment = computing ? computingAdornment() : null;

        const options = values.constructor.name !== 'Map' ?
            map(values, (possibleValue, key) => <MenuItem key={key} value={key}>{possibleValue}</MenuItem>) :
            map([...values], ([key, possibleValue]) => <MenuItem key={key} value={key}>{possibleValue}</MenuItem>) ;

        if(clearable)
            options.unshift(<MenuItem key={null} value={null}></MenuItem>);

        const selectValue = !multiple ?
            String(value || '') :
            (value || []) ;

        const input = (
            <Input
                type={'text'}
                name={name}
                disabled={disabled || readOnly}
                placeholder={placeholder}
                endAdornment={computedEndAdornment}
                fullWidth={true}
                inputProps={inputProps}
            />
        );

        return (
            <FormControl fullWidth={true} required={!!required} error={!!errors}>
                { label &&
                <InputLabel htmlFor={name} {...labelProps}>{label}</InputLabel>
                }
                <MuiSelect
                    classes={{ icon: cx({ [classes.hideMoreIcon]: computing }) }}
                    input={input}
                    value={selectValue}
                    multiple={multiple}
                    onFocus={this.onFocus}
                    onChange={onChange}
                    onBlur={this.onBlur}
                >{options}</MuiSelect>
                { !errors && helper &&
                <FormHelperText>{helper}</FormHelperText>
                }
                { errors &&
                <FormHelperText>{errors}</FormHelperText>
                }
            </FormControl>
        );
    }
}