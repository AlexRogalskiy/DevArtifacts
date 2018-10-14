import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './store/actions';

const DEBUG = false;

@connect((state, props) => ({
    form: state.forms[props.name],
}))
export default class Form extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        style: PropTypes.object,
        className: PropTypes.string,
        name: PropTypes.string.isRequired,
        submit: PropTypes.func.isRequired,
        autoComplete: PropTypes.string,

        initialValues: PropTypes.object,
        init: PropTypes.func,
        initArgs: PropTypes.any,
        removeOnUnmount: PropTypes.bool,

        dispatch: PropTypes.func.isRequired,
        form: PropTypes.object,
        debug: PropTypes.bool,
    };

    static defaultProps = {
        autoComplete: 'nope',
        removeOnUnmount: true,
    };

    static childContextTypes = {
        formName: PropTypes.string.isRequired,
    };

    getChildContext = () => {
        return {
            formName: this.props.name,
        };
    };

    componentWillMount = async () => {
        DEBUG && console.warn('componentWillMount', this.constructor.name);
        const { dispatch, name: formName } = this.props;
        dispatch(actions.addForm({ formName }));
    };

    componentDidMount = async () => {
        DEBUG && console.warn('componentDidMount', this.constructor.name);
        const { dispatch, name: formName } = this.props;
        const { initialValues, init, initArgs } = this.props;

        let values;

        if(init) {
            dispatch(actions.computingForm({ formName, value: true }));
            const values = await init(initArgs);
            dispatch(actions.computingForm({ formName, value: false }));
        }
        else {
            values = initialValues;
        }

        if(values)
            dispatch(actions.editForm({ formName, values }));
    };

    componentWillUnmount = async () => {
        DEBUG && console.warn('componentWillUnmount', this.constructor.name);
        const { dispatch, name: formName, removeOnUnmount } = this.props;

        if(removeOnUnmount)
            dispatch(actions.removeForm({ formName }));
    };

    submit = async event => {
        const { dispatch, form: { values, valid, validating, computing }, name: formName, submit } = this.props;

        if(event)
            event.preventDefault();

        const ready = !computing && !validating.length && valid;

        if(!ready)
            return;

        dispatch(actions.computingForm({ formName, value: true }));
        const result = await submit(values);
        dispatch(actions.computingForm({ formName, value: false }));
    };

    render = () => {
        const { children, style, className, name: formName, autoComplete } = this.props;

        return (
            <form style={style} className={className} name={formName} noValidate={true} autoComplete={autoComplete} onSubmit={this.submit}>
                {children}
            </form>
        );
    };
}