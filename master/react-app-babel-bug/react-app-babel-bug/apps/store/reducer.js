import * as types from './types';
import { cloneDeep, pull } from 'lodash-es';

const defaultState = {
    computing: [],
    notification: null,
    token: null,
    data: {},
};

export default (previousState = defaultState, action) => {
    const state = cloneDeep(previousState);

    switch(action.type) {
        case types.INIT: {
            return cloneDeep(defaultState);
        }
        case types.COMPUTE: {
            const { value } = action;
            state.computing.push(value);
            return state;
        }
        case types.COMPUTED: {
            const { value } = action;
            if(value === true)
                state.computing = [];
            else
                pull(state.computing, value);
            return state;
        }
        case types.NOTIFY: {
            const { level, content } = action;
            state.notification = { level, content };
            return state;
        }
        case types.NOTIFIED: {
            state.notification = null;
            return state;
        }
        case types.UNSET: {
            const { key, value } = action;
            const { data } = state;

            delete state.data[key];
            return state;
        }
        case types.SET: {
            const { key, value } = action;
            const { data } = state;

            state.data[key] = value;
            return state;
        }
        case types.SIGN_IN: {
            const { token } = action;
            state.token = token;
            return state;
        }
        case types.SIGN_OUT: {
            return cloneDeep(defaultState);
        }
        default: {
            return previousState;
        }
    }
};