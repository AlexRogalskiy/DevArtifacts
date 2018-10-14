export const PREFIX = '@@reax-form/';
export const NOOP = `${PREFIX}NOOP`;
export const INIT = `${PREFIX}INIT`;

export const ADD_FORM = `${PREFIX}ADD_FORM`;
export const EDIT_FORM = `${PREFIX}EDIT_FORM`;
export const REMOVE_FORM = `${PREFIX}REMOVE_FORM`;
export const COMPUTING_FORM = `${PREFIX}COMPUTING_FORM`;

export const ADD_INPUT = `${PREFIX}ADD_INPUT`;
export const EDIT_INPUT = `${PREFIX}EDIT_INPUT`;
export const REMOVE_INPUT = `${PREFIX}REMOVE_INPUT`;
export const COMPUTING_INPUT = `${PREFIX}COMPUTING_INPUT`;

export const FOCUS = `${PREFIX}FOCUS`;
export const CHANGE = `${PREFIX}CHANGE`;
export const BLUR = `${PREFIX}BLUR`;

export const RESET_VALIDATIONS = `${PREFIX}RESET_VALIDATIONS`;
export const VALIDATING = `${PREFIX}VALIDATING`;
export const VALIDATED = `${PREFIX}VALIDATED`;

export const SUBMITTING = `${PREFIX}SUBMITTING`;
export const SUBMITTED = `${PREFIX}SUBMITTED`;

export const FORM_NOT_REQUIRED = [NOOP, INIT, ADD_FORM];