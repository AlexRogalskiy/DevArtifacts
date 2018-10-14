import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { cloneDeep, map, without, uniq, difference } from 'lodash-es';
import cx from 'classnames';
import keyCode from 'keycode';
import { withStyles } from 'material-ui/styles';

import { FormGroup, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import MuiSwitch from 'material-ui/Switch';

import propTypes from './propTypes';

const errors = validations => map(validations, (value, key) => !value ? key : null).filter(value => value).join(',');

const noop = () => {};

@withStyles(theme => ({
}))
export default class Switch extends React.Component {
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
            <FormControlLabel
                label={name}
                control={
                    <MuiSwitch checked={!!value} onChange={proxiedChange} onBlur={proxiedBlur} />
                }
            />
        );
    }
}
