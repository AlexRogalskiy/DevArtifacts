import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, EmitterProvider, App } from 'reax-helpers';

import * as reducers from './reducers';
import Router, { history } from './router';

const development = process.env.NODE_ENV == 'development';

const persistConfig = {
    key: 'mui',
    keyPrefix: 'mui/',
    whitelist: ['main'],
    blacklist: ['routing'],
};

const { store, persistor } = createStore({ reducers, history, persistConfig, verbose: development, loggerCollapsed: true, loggerFilter: ['/persist'] });

window.persistor = persistor;

const app = (
    <EmitterProvider>
        <App store={store} persistor={persistor}>
            <Router />
        </App>
    </EmitterProvider>
);

ReactDOM.render(app, document.getElementById('app'));