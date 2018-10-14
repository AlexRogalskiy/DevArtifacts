import * as types from './types';

export const noop = () => ({ type: types.NOOP });
export const init = () => ({ type: types.INIT });

export const addForm = ({ formName }) => ({ type: types.ADD_FORM, formName });
export const editForm = ({ formName, values }) => ({ type: types.EDIT_FORM, formName, values });
export const removeForm = ({ formName }) => ({ type: types.REMOVE_FORM, formName });
export const computingForm = ({ formName, value }) => ({ type: types.COMPUTING_FORM, formName, value });

export const addInput = ({ formName, inputName }) => ({ type: types.ADD_INPUT, formName, inputName });
export const editInput = ({ formName, inputName, value }) => ({ type: types.EDIT_INPUT, formName, inputName, value });
export const removeInput = ({ formName, inputName }) => ({ type: types.REMOVE_INPUT, formName, inputName });
export const computingInput = ({ formName, inputName, value }) => ({ type: types.COMPUTING_INPUT, formName, inputName, value });

export const focus = ({ formName, inputName, value }) => ({ type: types.FOCUS, formName, inputName, value });
export const change = ({ formName, inputName, value }) => ({ type: types.CHANGE, formName, inputName, value });
export const blur = ({ formName, inputName, value }) => ({ type: types.BLUR, formName, inputName, value });

export const resetValidations = ({ formName, inputName }) => ({ type: types.RESET_VALIDATIONS, formName, inputName });
export const validating = ({ formName, inputName, validators, value }) => ({ type: types.VALIDATING, formName, inputName, validators, value });
export const validated = ({ formName, inputName, validator, value }) => ({ type: types.VALIDATED, formName, inputName, validator, value });