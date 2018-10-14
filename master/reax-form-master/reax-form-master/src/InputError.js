import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getContext } from 'recompose';

const connectWithFormName = (...args) => {
    return compose(
        getContext({ formName: PropTypes.string.isRequired }),
        connect(...args)
      );
};

@connectWithFormName((state, props) => ({
    form: state.forms[props.formName],
    input: state.forms[props.formName].inputs[props.name],
}))
export default class InputError extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        form: PropTypes.object,
        input: PropTypes.object,
        formName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        style: PropTypes.object,
        className: PropTypes.string,
        render: PropTypes.func.isRequired,
    };

    static contextTypes = {
        formName: PropTypes.string.isRequired,
    };

    render = () => {
        const { form, input, style, className, render } = this.props;

        if(!input)
            return null;

        const { valid, disabled, pristine, blurred, validations } = input;
        const { submitTried } = form;

        if(valid || disabled)
            return null;

        return <div style={style} className={className}>{render({ validations, pristine, blurred, submitTried, input, form })}</div>
    };
}