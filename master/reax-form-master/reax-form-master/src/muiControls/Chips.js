import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { cloneDeep, map, pick, pull } from 'lodash-es';
import keycode from 'keycode';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Paper from 'material-ui/Paper';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import Chip from 'material-ui/Chip';

import { MenuList, MenuItem } from 'material-ui/Menu';
import Autocomplete from './Autocomplete';

import ClearIcon from 'muicons/Close';

import { propTypesWithValues as propTypes } from './propTypes';

@withStyles(theme => ({
    container: {
        display: 'flex',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    autocomplete: {
        minWidth: 200,
        maxWidth: 400,
        flexBasis: 'auto',
        marginRight: 8,
        flexGrow: 1,
    },
    chip: {
        marginRight: 4,
        marginTop: 8,
    },
}))
export default class Chips extends React.Component {
    static propTypes = propTypes;

    getSuggestions = (value, values) => {
        const { match = 'startsWith', value: filterOut } = this.props;

        if(!value || !value.length)
            return [];

        const filterOutValues = filterOut.map(value => this.getLabel(value));

        if(Array.isArray(values)) {
            const suggestions = values.filter(v => !filterOutValues.includes(v)).filter(v => v.trim().toLowerCase()[match](value.trim().toLowerCase()));
            return suggestions;
        }
        else {
            const suggestions = new Map();
            for(const [key, v] of values) {
                if(filterOutValues.includes(v))
                    continue;

                if(v.trim().toLowerCase()[match](value.trim().toLowerCase()))
                    suggestions.set(key, v);
            }
            return suggestions;
        }
    };

    onFocus = event => {
        const { onFocus } = this.props;
        const value = ReactDOM.findDOMNode(this).getElementsByTagName('input')[0].value; //eslint-disable-line
        onFocus(value);
    };

    onAdd = v => {
        const { onChange, value } = this.props;

        const newValue = cloneDeep(value);

        if(v)
            newValue.push(v);

        onChange(newValue);
    };

    onRemove = v => () => {
        const { onChange, value } = this.props;

        const newValue = cloneDeep(value);

        if(v)
            pull(newValue, v);

        onChange(newValue);
    };

    onBlur = event => {
        const { onBlur } = this.props;
        const value = ReactDOM.findDOMNode(this).getElementsByTagName('input')[0].value; //eslint-disable-line
        onBlur(value);
    };

    getLabel = value => {
        const { values } = this.props;
        return (values.constructor.name === 'Map') ? values.get(value) : values[value];
    };

    render = () => {
        const { classes, value, onDelete, ...spreadProps } = this.props;

        return (
            <div className={classes.container}>
                <Autocomplete getSuggestions={this.getSuggestions} className={classes.autocomplete} {...spreadProps} onChange={this.onAdd} />
                { map(value, v => <Chip tabIndex={-1} className={classes.chip} key={v} label={this.getLabel(v)} onDelete={this.onRemove(v)} />) }
            </div>
        );
    }
}