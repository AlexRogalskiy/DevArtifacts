import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { pick, map } from 'lodash-es';
import keycode from 'keycode';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Paper from 'material-ui/Paper';
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
    suggestions: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        top: '100%',
        maxHeight: 300,
        overflow: 'scroll',
    },
    selected: {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
}))
export default class Chips extends React.Component {
    static propTypes = {
        ...propTypes,
        getSuggestions: PropTypes.func,
        match: PropTypes.oneOf(['startsWith', 'includes']),
    };

    static defaultProps = {
        match: 'startsWith',
    };

    state = {
        typingValue: '',
        suggestions: [],
        currentSelection: -1,
        currentSelectionKey: null,
    };

    getSuggestions = (value, values) => {
        const { match = 'startsWith' } = this.props;

        if(!value || !value.length)
            return [];

        if(Array.isArray(values)) {
            const suggestions = values.filter(v => v.trim().toLowerCase()[match](value.trim().toLowerCase()));
            return suggestions;
        }
        else {
            const suggestions = new Map();
            for(const [key, v] of values) {
                if(v.trim().toLowerCase()[match](value.trim().toLowerCase()))
                    suggestions.set(key, v);
            }
            return suggestions;
        }
    };

    clearSuggestions = () => this.setState({ suggestions: [], currentSelection: -1, currentSelectionKey: null, typingValue: '' });

    chooseWithClick = value => () => {
        const { onChange } = this.props;
        onChange(value);
        this.clearSuggestions();
    };

    chooseWithKey = () => {
        const { onChange } = this.props;
        const { currentSelectionKey: value } = this.state;
        onChange(value);
        this.clearSuggestions();
    };

    moveSelection = move => {
        const { suggestions, currentSelection } = this.state;
        const maxIndex = Array.isArray(suggestions) ? suggestions.length : suggestions.size;

        let nextCurrentSelection = currentSelection + move;
        if(nextCurrentSelection < 0)
            nextCurrentSelection = 0;
        else if(nextCurrentSelection > maxIndex - 1)
            nextCurrentSelection = maxIndex;

        const currentSelectionKey = Array.isArray(suggestions) ? suggestions[nextCurrentSelection] : ([...suggestions][nextCurrentSelection] && [...suggestions][nextCurrentSelection][0]);

        this.setState({ currentSelection: nextCurrentSelection, currentSelectionKey });
    };

    onFocus = event => {
        const { onFocus } = this.props;
        const value = ReactDOM.findDOMNode(this).getElementsByTagName('input')[0].value; //eslint-disable-line
        onFocus(value);
    };

    onKeyDown = event => {
        const keyPressed = keycode(event);

        if(['enter'].includes(keyPressed)) {
            event.preventDefault();
            return this.chooseWithKey();
        }
        else if(['esc'].includes(keyPressed)) {
            event.preventDefault();
            return this.clearSuggestions();
        }
        else if(['tab'].includes(keyPressed)) {
            return this.clearSuggestions();
        }
    };

    onKeyUp = event => {
        const { match, values, getSuggestions = this.getSuggestions } = this.props;
        const value = event.target.value;
        const keyPressed = keycode(event);

        if(['enter', 'esc', 'tab', 'shift'].includes(keyPressed))
            return;

        const suggestions = getSuggestions(value, values);

        let move = 0;
        if(keyPressed === 'up')
            move = -1;
        else if(keyPressed === 'down')
            move = +1;

        this.setState({ suggestions }, () => this.moveSelection(move));
    };

    onChange = event => {
        const { onChange } = this.props;
        const { value: typingValue } = event.target;
        onChange(null);
        this.setState({ typingValue });
    };

    onBlur = event => {
        const { onBlur } = this.props;
        const value = ReactDOM.findDOMNode(this).getElementsByTagName('input')[0].value; //eslint-disable-line
        onBlur(value);
    };

    render = () => {
        const { classes, className } = this.props;
        const { multiple, name, value, values, onFocus, onChange, onBlur } = this.props;
        const { label = name, required, readOnly, disabled, placeholder, helper, computing, clearable, errorRender } = this.props;
        const { multiline, rows, rowsMax } = this.props;
        const { controlProps, labelProps, helperProps } = this.props;
        const { typingValue, suggestions, currentSelection, currentSelectionKey } = this.state;

        const inputProps = pick(this.props, ['id', 'name', 'autoComplete', 'noValidate', 'required', 'pattern', 'minLength', 'maxLength', 'step', 'min', 'max' ]);

        const errors = errorRender(this.props);

        const computingAdornment = () => (
            <InputAdornment position={'end'}>
                <CircularProgress />
            </InputAdornment>
        );

        const computedEndAdornment = computing ? computingAdornment() : null;

        const options = suggestions.constructor.name !== 'Map' ?
            map(suggestions, (possibleValue, key) => <MenuItem className={cx({ [classes.selected]: currentSelectionKey === key})} key={key} value={key} onClick={this.chooseWithClick(key)}>{possibleValue}</MenuItem>) :
            map([...suggestions], ([key, possibleValue]) => <MenuItem className={cx({ [classes.selected]: currentSelectionKey === key})} key={key} value={key} onClick={this.chooseWithClick(key)}>{possibleValue}</MenuItem>) ;

        if(!['Map', 'Array'].includes(values.constructor.name))
            return null;

        const choosenValue = Array.isArray(values) ? values[value] : values.get(value);

        return (
            <FormControl className={className} fullWidth={true} required={!!required} error={!!errors}>
                { label &&
                <InputLabel htmlFor={name} {...labelProps}>{label}</InputLabel>
                }
                <Input
                    type={'text'}
                    name={name}
                    disabled={disabled || readOnly}
                    placeholder={placeholder}
                    endAdornment={computedEndAdornment}
                    fullWidth={true}
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}
                    onChange={this.onChange}
                    value={choosenValue || typingValue || ''}
                    inputProps={inputProps}
                />
                { !!(suggestions.length || suggestions.size) &&
                <Paper className={classes.suggestions}>
                    {options}
                </Paper>
                }
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