import React from 'react';
import PropTypes from 'prop-types';
import { map, pick, omit } from 'lodash-es';

const domPropsNames = ['ref', 'className', 'style', 'id', 'name', 'disabled', 'autofocus', 'readOnly', 'autocomplete', 'pattern', 'minLength', 'maxLength', 'min', 'max', 'step', 'novalidate'];

export class Text extends React.Component {
    render = () => {
        const { value, onFocus, onChange, onBlur } = this.props;
        const domProps = pick(this.props, domPropsNames)

        return (
            <input
                {...domProps}
                type={'text'}
                value={value || ''}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
            />
        );
    };
}

export class Secret extends React.Component {
    render = () => {
        const { value, onFocus, onChange, onBlur } = this.props;
        const domProps = pick(this.props, domPropsNames)

        return (
            <input
                {...domProps}
                type={'password'}
                value={value || ''}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
            />
        );
    };
}

export class Number extends React.Component {
    render = () => {
        const { value, onFocus, onChange, onBlur } = this.props;
        const domProps = pick(this.props, domPropsNames)

        return (
            <input
                {...domProps}
                type={'number'}
                value={value || ''}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
            />
        );
    };
}

export class Checkbox extends React.Component {
    onChange = event => {
        const { onChange } = this.props;
        onChange(event.target.checked);
    };

    render = () => {
        const { value, onFocus, onBlur } = this.props;
        const domProps = pick(this.props, domPropsNames)

        return (
            <input
                {...domProps}
                type={'checkbox'}
                value={!!value}
                checked={!!value}
                onFocus={onFocus}
                onChange={this.onChange}
                onBlur={onBlur}
            />
        );
    };
}

export class Radio extends React.Component {
    render = () => {
        const { value, values, onFocus, onChange, onBlur } = this.props;
        const domProps = pick(this.props, domPropsNames)

        const options = values.constructor.name !== 'Map' ?
            map(values, (possibleValue, key) => <input key={key} type={'radio'} {...domProps} onFocus={onFocus} onChange={onChange} onBlur={onBlur} value={key} checked={possibleValue === value} />) :
            map([...values], ([key, possibleValue]) => <input key={key} type={'radio'} {...domProps} onFocus={onFocus} onChange={onChange} onBlur={onBlur} value={key} checked={possibleValue === value} />) ;

        return (
            <radiogroup
                {...domProps}
                value={value || ''}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
            >{options}</radiogroup>
        );
    };
}

export class Select extends React.Component {
    render = () => {
        const { value, values, onFocus, onChange, onBlur } = this.props;
        const domProps = pick(this.props, domPropsNames)

        const options = values.constructor.name !== 'Map' ?
            map(values, (possibleValue, key) => <option key={key} value={key}>{possibleValue}</option>) :
            map([...values], ([key, possibleValue]) => <option key={key} value={key}>{possibleValue}</option>) ;

        return (
            <select
                {...domProps}
                value={value || ''}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
            >{options}</select>
        );
    };
}

export class SelectMultiple extends React.Component {
    onChange = event => {
        const { onChange } = this.props;
        const value = [...event.target.options].filter(option => option.selected).map(option => option.value);
        onChange(value);
    };

    render = () => {
        const { value, values, onFocus, onBlur } = this.props;
        const domProps = pick(this.props, domPropsNames)

        const options = values.constructor.name !== 'Map' ?
            map(values, (possibleValue, key) => <option key={key} value={key}>{possibleValue}</option>) :
            map([...values], ([key, possibleValue]) => <option key={key} value={key}>{possibleValue}</option>) ;

        return (
            <select
                {...domProps}
                multiple={true}
                value={value || []}
                onFocus={onFocus}
                onChange={this.onChange}
                onBlur={onBlur}
            >{options}</select>
        );
    };
}

const propTypes = {
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,

    values: PropTypes.any,
    value: PropTypes.any,

    focused: PropTypes.bool.isRequired,
    changed: PropTypes.bool.isRequired,
    blurred: PropTypes.bool.isRequired,
    computing: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    validating: PropTypes.array.isRequired,
    validations: PropTypes.object.isRequired,
};

Text.propTypes = propTypes;
Secret.propTypes = propTypes;
Number.propTypes = propTypes;
Checkbox.propTypes = propTypes;
Radio.propTypes = propTypes;
Select.propTypes = propTypes;
SelectMultiple.propTypes = propTypes;