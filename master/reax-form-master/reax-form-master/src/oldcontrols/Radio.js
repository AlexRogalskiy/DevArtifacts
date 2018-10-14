import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { cloneDeep, map, without, uniq, difference } from 'lodash-es';
import cx from 'classnames';
import keyCode from 'keycode';
import { withStyles } from 'material-ui/styles';

import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import MuiRadio, { RadioGroup as MuiRadioGroup } from 'material-ui/Radio';

import MuiCheckbox from 'material-ui/Checkbox';

import propTypes from './propTypes';

const noop = () => {};

@withStyles(theme => ({
    radioGroup: {
        flexDirection: 'row',
    },
}))
export default class Radio extends React.Component {
    static propTypes = propTypes;

    render () {
        const { classes, elementRef, onChange, onBlur, name, value, values, disabled, valid, validations, pristine, blurred, readOnly, required, pattern, minLength, maxLength, placeholder, description } = this.props;
        const { displayName, clearAction, errorRender, disableLabel, disableUnderline } = this.props;
        const proxiedChange = (event, value) => onChange(value);
        const proxiedBlur = (event, value) => onBlur(value);

        const errors = errorRender(this.props);

        return (
            <FormControl className={classes.formControl} fullWidth={true} required={!!required} error={!!errors}>
                {!disableLabel && <FormLabel htmlFor={name}>{displayName || name}</FormLabel>}
                <MuiRadioGroup className={classes.radioGroup} name={name} value={value} onChange={proxiedChange}>
                    { map(values, value => <FormControlLabel key={value} value={value} label={value} control={<MuiRadio name={name} />} /> )}
                </MuiRadioGroup>
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
