import { pickBy } from 'lodash-es';

export Form from './Form';
export Input from './Input';

// export InputError from './InputError';
// export errorRender from './errorRender';
export * as muiControls from './muiControls';
export * as controls from './controls/formControls';

// export Gallery from './Gallery';

export * as types from './store/types';
export * as actions from './store/actions';
export reducer from './store/reducer';
export { defaultFormState, defaultInputState } from './store/reducer';

export const errorRender = args => {
    const { valid, validations } = args;
    return valid ? null : Object.keys(pickBy(validations, value => !value)).join();
};