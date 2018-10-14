import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { cloneDeep, map, without, uniq, difference } from 'lodash-es';
import cx from 'classnames';
import keyCode from 'keycode';
import { withStyles } from 'material-ui/styles';

import { FormGroup, FormControl, FormLabel, FormControlLabel, FormHelperText } from 'material-ui/Form';
import MuiCheckbox from 'material-ui/Checkbox';

import propTypes from './propTypes';

const errors = validations => map(validations, (value, key) => !value ? key : null).filter(value => value).join(',');

const noop = () => {};

@withStyles(theme => ({
}))
export default class Checkbox extends React.Component {
    static propTypes = {
        ...propTypes,
        value: PropTypes.bool,
        initialValue: PropTypes.bool,
    }

    render () {
        const { elementRef, onChange, onBlur, name, value, disabled, valid, validations, pristine, blurred, readOnly, required, pattern, minLength, maxLength, placeholder, description } = this.props;
        const proxiedChange = (event, checked) => onChange(checked ? true : false);
        const proxiedBlur = (event, checked) => onBlur(checked ? true : false);

        return (
            <FormControl fullWidth={true} required={!!required} error={!pristine && !valid}>
                <FormLabel>{name}</FormLabel>
                <FormControlLabel label={name} control={
                    <MuiCheckbox
                        checked={value}
                        onChange={readOnly ? noop : proxiedChange}
                        onBlur={readOnly ? noop : proxiedBlur}
                        value={''}
                        disabled={disabled}
                    />
                } />
                { (pristine || valid) && description &&
                <FormHelperText>{description}</FormHelperText>
                }
                { !pristine && !valid &&
                <FormHelperText>{errors(validations)}</FormHelperText>
                }
            </FormControl>
        );
    }
}
