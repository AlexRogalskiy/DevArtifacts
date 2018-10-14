import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { cloneDeep, map, without, uniq, difference } from 'lodash-es';
import cx from 'classnames';
import keyCode from 'keycode';
import { withStyles } from 'material-ui/styles';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';

import ClearIcon from 'muicons/ContentClear';

import rightActionStyles from './rightActionStyles';

import propTypes from './propTypes';

@withStyles(theme => ({
    ...rightActionStyles,
}))
export default class Text extends React.Component {
    static propTypes = {
        ...propTypes,
        clearAction: PropTypes.bool,
        noLabel: PropTypes.bool,
    };

    static defaultProps = {
        clearAction: false,
        disableLabel: false,
        disableUnderline: false,
    };

    render () {
        const { classes, elementRef, onChange, onBlur, name, value, values, disabled, valid, validations, pristine, blurred, readOnly, required, pattern, minLength, maxLength, placeholder, description } = this.props;
        const { displayName, clearAction, errorRender, disableLabel, disableUnderline } = this.props;
        const proxiedChange = event => onChange(event.target.value);
        const proxiedBlur = event => onBlur(event.target.value);

        const errors = errorRender(this.props);

        return (
            <FormControl className={classes.formControl} fullWidth={true} required={!!required} error={!!errors}>
                {!disableLabel && <InputLabel htmlFor={name}>{displayName || name}</InputLabel>}
                <Input
                    type={'text'}
                    id={name}
                    placeholder={placeholder}
                    value={value || ''}
                    minLength={minLength}
                    maxLength={maxLength}
                    onChange={proxiedChange}
                    onBlur={proxiedBlur}
                    disabled={disabled}
                    inputProps={{ disabled, readOnly }}
                    disableUnderline={disableUnderline}
                    multiline={true}
                />
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
