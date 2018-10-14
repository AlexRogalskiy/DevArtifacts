import PropTypes from 'prop-types';

export const propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.array]),
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    valid: PropTypes.bool,
    computing: PropTypes.bool,

    required: PropTypes.bool,
    pattern: PropTypes.object,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,

    label: PropTypes.any,
    placeholder: PropTypes.string,
    helper: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    syncValidators: PropTypes.object,
    asyncValidators: PropTypes.object,
};

export const propTypesWithValues = {
    ...propTypes,
    values: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.instanceOf(Map), PropTypes.func]),
};