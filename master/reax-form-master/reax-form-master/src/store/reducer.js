import { cloneDeep, reduce, pick, pull, pullAll, uniq } from 'lodash-es';
import * as types from './types';

export const defaultState = {};

export const defaultFormState = {
    focused: false,
    changed: false,
    submitted: false,
    computing: false,
    valid: true,
    validating: [],
    values: {},
    inputs: {},
};

export const defaultInputState = {
    value: null,
    lastValidatedValue: null,
    focused: false,
    changed: false,
    blurred: false,
    computing: false,
    valid: true,
    validating: [],
    validations: {},
};

export const computeFormValues = inputs => {
    const result = reduce (inputs, (reduced, input, inputName) => {
        const { value } = input;
        reduced[inputName] = value;
        return reduced;
    }, {});
    return result;
};

export const computeFormValid = inputs => {
    const result = reduce (inputs, (reduced, input, inputName) => {
        const { valid } = input;
        return reduced && valid;
    }, true);
    return result;
};

export default (previousState = defaultState, action) => {
    const state = cloneDeep(previousState);

    const { formName, inputName } = action;

    const form = state[formName];
    const inputs = form && form.inputs;
    const input = inputs && inputs[inputName];

    /*
        <Form /> may be already unmounted when this action was dispatched.
        Check if a FORM action was dispatched AND form is not initialised AND the action requires the form to be initialised
    */
    const isFormAction = action.type.startsWith(types.PREFIX);
    if(isFormAction && !form && !types.FORM_NOT_REQUIRED.includes(action.type)) {
        console.warn(`${action.type} was dispatched when <Form/> was unmounted thus it will not be reduced`);
        return state;
    }

    switch(action.type) {
        case types.NOOP: {
            return state;
        }
        case types.INIT: {
            return defaultState;
        }
        case types.ADD_FORM: {
            const { formName } = action;
            const form = cloneDeep(defaultFormState);
            state[formName] = form;
            return state;
        }
        case types.EDIT_FORM: {
            const { values } = action;

            for(const inputName in values)
                if(inputs[inputName])
                    inputs[inputName].value = values[inputName];

            form.values = computeFormValues(form.inputs);
            form.changed = true;

            return state;
        }
        case types.REMOVE_FORM: {
            const { formName } = action;
            delete state[formName];
            return state;
        }
        case types.COMPUTING_FORM: {
            const { value } = action;
            form.computing = value;
            return state;
        }
        case types.ADD_INPUT: {
            const { formName, inputName, value } = action;
            const newState = { ...previousState };
            const input = cloneDeep(defaultInputState);

            newState[formName].inputs = { ...newState[formName].inputs, [inputName]: input };
            newState[formName].values = computeFormValues(newState[formName].inputs);
            newState[formName].valid = computeFormValid(newState[formName].inputs);

            return newState;
        }
        case types.REMOVE_INPUT: {
            const { formName, inputName, value } = action;
            const newState = { ...previousState };

            delete newState[formName].inputs[inputName];
            newState[formName].values = computeFormValues(newState[formName].inputs);
            return state;
        }
        case types.COMPUTING_INPUT: {
            const { formName, inputName, value } = action;
            const newState = { ...previousState };
            const form = { ...newState[formName] };
            const inputs = { ...form.inputs };
            const input = { ...inputs[inputName] };

            input.computing = value;

            newState[formName] = form;
            newState[formName].inputs = inputs;
            newState[formName].inputs[inputName] = input;
            return newState;
        }
        case types.FOCUS: {
            const { formName, inputName } = action;
            const newState = { ...previousState };
            const form = { ...newState[formName] };
            const inputs = { ...form.inputs };
            const input = { ...inputs[inputName] };

            input.focused = true;
            form.focused = true;

            newState[formName] = form;
            newState[formName].inputs = inputs;
            newState[formName].inputs[inputName] = input;
            return newState;
        }
        case types.EDIT_INPUT: {
            const { inputName, value } = action;

            const newValue = cloneDeep(value); //safe guard against arrays and object in the future
            input.value = newValue;
            input.changed = true;
            form.values = computeFormValues(form.inputs);
            form.valid = computeFormValid(form.inputs);
            form.changed = true;

            return state;
        }
        case types.CHANGE: {
            const { inputName, value } = action;

            const newValue = cloneDeep(value); //safe guard against arrays and object in the future
            input.value = newValue;
            input.changed = true;
            form.values = computeFormValues(form.inputs);
            form.valid = computeFormValid(form.inputs);
            form.changed = true;

            return state;
        }
        case types.BLUR: {
            const { formName, inputName } = action;
            const newState = { ...previousState };
            const form = { ...newState[formName] };
            const inputs = { ...form.inputs };
            const input = { ...inputs[inputName] };

            input.blurred = true;

            newState[formName] = form;
            newState[formName].inputs = inputs;
            newState[formName].inputs[inputName] = input;
            return newState;
        }
        case types.RESET_VALIDATIONS: {
            const { formName, inputName } = action;
            const newState = { ...previousState };
            const form = { ...newState[formName] };
            const inputs = { ...form.inputs };
            const input = { ...inputs[inputName] };

            input.valid = true;
            input.validating = [];
            input.validations = {};

            newState[formName] = form;
            newState[formName].inputs = inputs;
            newState[formName].inputs[inputName] = input;
            return newState;
        }
        case types.VALIDATING: {
            const { formName, inputName, validators, value } = action;
            const newState = { ...previousState };
            const form = { ...newState[formName] };
            const inputs = { ...form.inputs };
            const input = { ...inputs[inputName] };

            input.valid = true;
            input.lastValidatedValue = value;
            input.validating = input.validating.concat(validators);
            input.validating = uniq(input.validating);

            if(input.validating.length) {
                form.validating.push(inputName);
                form.validating = uniq(form.validating);
            }
            form.valid = computeFormValid(inputs);

            newState[formName] = form;
            newState[formName].inputs = inputs;
            newState[formName].inputs[inputName] = input;
            return newState;
        }
        case types.VALIDATED: {
            const { formName, inputName, validator, value } = action;
            const newState = { ...previousState };
            const form = { ...newState[formName] };
            const inputs = { ...form.inputs };
            const input = { ...inputs[inputName] };

            pull(input.validating, validator);
            input.valid = input.valid && value;
            input.validations[validator] = value;

            pull(form.validating, inputName);
            form.valid = computeFormValid(inputs);

            newState[formName] = form;
            newState[formName].inputs = inputs;
            newState[formName].inputs[inputName] = input;

            newState[formName].valid = computeFormValid(newState[formName].inputs);
            return newState;
        }
        default: {
            return previousState;
        }
    }
};