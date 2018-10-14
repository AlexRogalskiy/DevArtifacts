import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getContext } from 'recompose';
import { get, reduce, pull, isEqual, pick, omit, debounce } from 'lodash-es';
import diff from 'deep-diff';

import { defaultInputState } from './store/reducer';
import * as actions from './store/actions';
import * as defaultValidators from './utils/validators';

const connectWithFormName = (...args) => {
    return compose(
        getContext({ formName: PropTypes.string.isRequired, formStep: PropTypes.string }),
        connect(...args)
    );
};

const DEBUG = false;

@connectWithFormName((state, props) => ({
    formValues: get(state.forms, `${props.formName}.values`, {}),
    input: get(state.forms, `${props.formName}.inputs.${props.name}`, defaultInputState),
}))
export default class Input extends React.Component {
    static contextTypes = {
        formName: PropTypes.string.isRequired,
    };

    static propTypes = {
        formName: PropTypes.string.isRequired,

        dispatch: PropTypes.func.isRequired,
        formValues: PropTypes.object.isRequired,
        input: PropTypes.object.isRequired,

        initialValue: PropTypes.any,
        init: PropTypes.func,
        initArgs: PropTypes.any,

        render: PropTypes.any.isRequired,
        name: PropTypes.string.isRequired,
        values: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.instanceOf(Map), PropTypes.func]),

        disabled: PropTypes.bool,

        debounce: PropTypes.number,
        syncValidators: PropTypes.object,
        asyncValidators: PropTypes.object,
        watch: PropTypes.func,

        required: PropTypes.bool,
        pattern: PropTypes.instanceOf(RegExp),
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
        step: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,

        updateOnFormValues: PropTypes.bool,
    };

    static defaultProps = {
        debounce: 500,
        syncValidators: undefined,
        asyncValidators: undefined,
        updateOnFormValues: false,
    };

    state = {
        values: {},
    };

    static dynamicProps = ['input', 'disabled', 'debounce', 'syncValidators', 'asyncValidators', 'watch', 'required', 'pattern', 'minLength', 'maxLength', 'step', 'min', 'max'];
    static triggerValidateOn = ['input.value', 'input.validations', 'values', 'syncValidators', 'asyncValidators', 'required', 'pattern', 'minLength', 'maxLength', 'step', 'min', 'max'];
    static defaultValidators = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];

    componentWillMount = async () => {
        DEBUG && console.warn('componentWillMount', this.constructor.name);
        const { dispatch, formName, name: inputName, debounce: debounceTime } = this.props;
        dispatch(actions.addInput({ formName, inputName }));

        this.debouncedValidate = debounce(this.validate, debounceTime);
    };

    componentDidMount = async () => {
        DEBUG && console.warn('componentDidMount', this.constructor.name);
        const { dispatch, formName, name: inputName } = this.props;
        const { values, initialValue, init, initArgs } = this.props;

        // possible values
        let computedValues = values;

        if(typeof values === 'function') {
            dispatch(actions.computingInput({ formName, inputName, value: true }));
            computedValues = await values();
            dispatch(actions.computingInput({ formName, inputName, value: false }));
        }

        if(Array.isArray(computedValues))
            computedValues = computedValues.reduce((reduced, nextValue) => (reduced[nextValue] = nextValue) && reduced, {});

        if(computedValues) {
            DEBUG && console.log('computedValues', computedValues)
            this.setState({ values: computedValues });
        }

        // initial value
        let computedValue = initialValue;
        if(init) {
            dispatch(actions.computingInput({ formName, inputName, value: true }));
            computedValue = await init(initArgs);
            dispatch(actions.computingInput({ formName, inputName, value: false }));
        }

        //important! this could be 0.00
        if(computedValue !== undefined) {
            DEBUG && console.log('computedValue', computedValue)
            dispatch(actions.editInput({ formName, inputName, value: computedValue }));
        }

        await this.validate(initialValue);
        this.forceUpdate();
    };

    componentWillUnmount = async () => {
        DEBUG && console.warn('componentWillUnmount', this.constructor.name);
        const { dispatch, formName, name: inputName } = this.props;
        dispatch(actions.removeInput({ formName, inputName }));
    };

    componentWillReceiveProps = nextProps => {
        const previousProps = this.props;

        const { dispatch, formName, name: inputName, disabled: previousDisabled } = previousProps;
        const { disabled: nextDisabled } = nextProps;

        if(!previousDisabled && nextDisabled) {
            DEBUG && console.warn('disabling/removing input');
            dispatch(actions.removeInput({ formName, inputName }));
        }
        else if(previousDisabled && !nextDisabled) {
            dispatch(actions.addInput({ formName, inputName }));
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const previousProps = this.props;
        const previousState = this.state;
        const { updateOnFormValues } = previousProps;

        const previousButFormValues = omit(previousProps, ['formValues']);
        const nextButFormValues = omit(nextProps, ['formValues']);

        const diffs = updateOnFormValues ? diff(previousProps, nextProps) : diff(previousButFormValues, nextButFormValues);
        const shouldUpdate = diffs && !!diffs.length ? true : false;

        DEBUG && console.warn('shouldComponentUpdate', this.props.name, diffs, '=>', shouldUpdate);
        return shouldUpdate;
    };

    componentDidUpdate = previousProps => {
        const nextProps = this.props;

        const previousTriggerable = pick(previousProps, Input.triggerValidateOn);
        const nextTriggerable = pick(nextProps, Input.triggerValidateOn);

        const diffs = diff(previousTriggerable, nextTriggerable);
        const shouldValidate = diffs && !!diffs.length ? true : false;

        DEBUG && console.warn('componentDidUpdate:shouldValidate', this.props.name, diffs, '=>', shouldValidate);

        if(shouldValidate) {
            this.debouncedValidate.cancel();
            this.validate(nextProps.input.value, true);
        }
    };

    onFocus = eventOrValue => {
        const { dispatch, formName, name: inputName } = this.props;
        if(eventOrValue && eventOrValue.target && eventOrValue.target.tagName && eventOrValue.target.tagName.toLowerCase() === 'button')
            return;

        const value = eventOrValue === null ? null : get(eventOrValue, 'target.value', eventOrValue);
        DEBUG && console.warn('onFocus', value);
        dispatch(actions.focus({ formName, inputName, value }));
    };

    onChange = eventOrValue => {
        const { dispatch, formName, name: inputName, formValues: values, watch } = this.props;
        if(eventOrValue && eventOrValue.target && eventOrValue.target.tagName && eventOrValue.target.tagName.toLowerCase() === 'button')
            return;

        const value = eventOrValue === null ? null : get(eventOrValue, 'target.value', eventOrValue);
        DEBUG && console.warn('onChange', value);
        dispatch(actions.change({ formName, inputName, value }));
        this.debouncedValidate(value);
        if(watch)
            watch(value, values);
    };

    onBlur = eventOrValue => {
        const { dispatch, formName, name: inputName } = this.props;
        if(eventOrValue && eventOrValue.target && eventOrValue.target.tagName && eventOrValue.target.tagName.toLowerCase() === 'button')
            return;

        const value = eventOrValue === null ? null : get(eventOrValue, 'target.value', eventOrValue);
        DEBUG && console.warn('onBlur', value);
        dispatch(actions.blur({ formName, inputName, value }));
        this.debouncedValidate.cancel();
        this.validate(value);
    };

    validate = async (value, force) => {
        const { dispatch, formName, name: inputName, formValues: values, input: { lastValidatedValue }, syncValidators = {}, asyncValidators = {} } = this.props;

        if(!force && isEqual(value, lastValidatedValue)) {
            DEBUG && console.warn('skipping validation');
            return;
        }

        //clean up previous validations
        dispatch(actions.resetValidations({ formName, inputName }));

        const props = this.props;
        for(const validatorName of Input.defaultValidators) {
            const validator = defaultValidators[validatorName];
            if(props[validatorName] !== undefined) {
                syncValidators[validatorName] = ({ value, values }) => validator(value, props[validatorName]);
            }
        }

        const validatorNames = [...Object.keys(syncValidators), ...Object.keys(asyncValidators)];
        if(!validatorNames.length)
            return;

        pull(validatorNames, 'required'); //special treatment 😓

        if(props.required) {
            dispatch(actions.validating({ formName, inputName, value, validators: validatorNames }));
            const result = syncValidators.required({ value, values });
            dispatch(actions.validated({ formName, inputName, validator: 'required', value: result }));

            // console.log(inputName, 'is required and required-validation is', result);

            if(!result)
                return;
        }

        if(props.required || value) {
            // console.log(inputName, 'is required or value is present so validating all the validators');

            dispatch(actions.validating({ formName, inputName, value, validators: validatorNames }));

            let valid = true;

            for(const validatorName in syncValidators) {
                const validator = syncValidators[validatorName];
                const result = validator({ value, values });

                if(result) {
                    dispatch(actions.validated({ formName, inputName, validator: validatorName, value: true }));
                }
                else {
                    dispatch(actions.validated({ formName, inputName, validator: validatorName, value: false }));
                    valid = false;
                }

                if(!valid)
                    break;
            }

            for(const validatorName in asyncValidators) {
                const validator = asyncValidators[validatorName];
                const result = valid && await validator({ value, values });

                if(result) {
                    dispatch(actions.validated({ formName, inputName, validator: validatorName, value: true }));
                }
                else {
                    dispatch(actions.validated({ formName, inputName, validator: validatorName, value: false }));
                    valid = false;
                }

                if(!valid)
                    break;
            }
        }
    };

    render = () => {
        const { render: Render, input } = this.props;
        const { values } = this.state;

        return <Render {...this.props} values={values} {...input} onFocus={this.onFocus} onChange={this.onChange} onBlur={this.onBlur} />;
    };
}
