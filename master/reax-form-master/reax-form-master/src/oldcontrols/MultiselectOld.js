import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { cloneDeep, map, without, uniq, difference, reduce } from 'lodash-es';
import cx from 'classnames';
import keyCode from 'keycode';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Menu, { MenuList, MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';

import propTypes from './propTypes';

@withStyles(theme => ({
    chip: {
        display: 'inline-flex',
        margin: '2px',
    },
}))
export default class Multiselect extends React.Component {
    static propTypes = {
        ...propTypes,
        value: PropTypes.array,
        initialValue: PropTypes.array,
        suggestionComparator: PropTypes.oneOf(['startsWith', 'includes']),
    };

    static defaultProps = {
        suggestionComparator: 'startsWith',
    };

    state = {
        open: false,
        computing: false,
        values: {},
        suggestions: [],
    };

    async componentWillMount () {
        const { values } = this.props;

        this.setState({ computing: true });
        let computedValues = (typeof values === 'function') ? await values() : values;
        if(Array.isArray(computedValues)) {
            computedValues = computedValues.reduce((reduced, nextValue) => {
                reduced[nextValue] = nextValue;
                return reduced;
            }, {});
        }
        this.setState({ computing: false, values: computedValues });
    }

    @autobind
    keyUp (event) {
        event.preventDefault();
        if(keyCode(event) === 'enter')
            this.addValue(event.target.value);
        else
            this.autocomplete(event.target.value);
    }

    @autobind
    autocomplete (value) {
        const { value: currentValue = [], suggestionComparator } = this.props;
        const { values } = this.state;

        if(!value)
            return;

        const suggestions = reduce(values, (reduced, suggestion, key) => {
            if(currentValue.includes(key))
                return reduced;
            if(suggestion.trim().toLowerCase()[suggestionComparator](value.trim().toLowerCase())) //includes or startsWith?
                reduced[key] = suggestion;
            return reduced;
        }, {});

        // const suggestions = difference(values, currentValue).filter(suggestion => suggestion.trim().toLowerCase().startsWith(value.trim().toLowerCase()));
        // console.log('suggestions for', value, 'are', suggestions);
        this.setState({ suggestions });
    }

    @autobind
    addValue (value) {
        const { onChange, value: currentValue } = this.props;
        const { values } = this.state;

        if(!values[value])
            return;

        let finalValue = (currentValue || []).concat([value]);
        finalValue = uniq(finalValue);
        onChange(finalValue);
        this.inputRef.value = '';
        this.closeMenu();
    }

    @autobind
    removeValue (value) {
        const { onChange, value: currentValue } = this.props;
        const { values } = this.state;

        let finalValue = without(currentValue, value);
        finalValue = uniq(finalValue);
        onChange(finalValue);
    }

    @autobind
    closeMenu () {
        this.setState({ suggestions: [] });
    }

    render () {
        const { classes } = this.props;
        const { elementRef, onChange, onBlur, name, value, disabled, valid, validations, pristine, blurred, required, description, placeholder, errorRender } = this.props;
        const { values, anchorEl, open, suggestions } = this.state;

        const errors = errorRender(this.props);

        return (
            <Grid container={true} spacing={0} justify={'flex-start'} align={'center'} wrap={'wrap'}>
                <Grid item={true} xs={3}>
                    <FormControl fullWidth={true} required={!!required} error={!!errors}>
                        <InputLabel htmlFor={name}>{name}</InputLabel>
                        <Input
                            inputRef={ref => this.inputRef = ref}
                            style={{ marginLeft: value && value.length ? '5px' : '0x' }}
                            placeholder={placeholder}
                            onChange={event => this.autocomplete(event.target.value)}
                            onKeyUp={this.keyUp}
                            onFocus={this.keyUp}
                        />
                    </FormControl>
                    <Menu anchorEl={this.inputRef} open={!!Object.keys(suggestions).length} onRequestClose={this.closeMenu} name={name}>
                        { map(suggestions, (value, key) => <MenuItem key={key} onClick={() => this.addValue(key)}>{value}</MenuItem>) }
                    </Menu>
                </Grid>
                <Grid item={true} xs={9}>
                    { map(value, (value, key) => <Chip className={classes.chip} key={key} label={values[value]} onRequestDelete={() => this.removeValue(value)} />) }
                </Grid>
                <Grid item={true} xs={12}>
                { !errors && description &&
                <FormHelperText>{description}</FormHelperText>
                }
                { errors &&
                <FormHelperText>{errors}</FormHelperText>
                }
                </Grid>
            </Grid>
        );
    }
}