import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { createLogger } from 'redux-logger';

export default ({ reducers, history, verbose, loggerFilter = [] }) => {
    reducers.routing = routerReducer;

    const reducer = combineReducers(reducers);

    const historyMiddleware = routerMiddleware(history);

    const loggerMiddleware = createLogger({
        duration: true,
        diff: true,
        collapsed: true,
        predicate: (getState, action) => !loggerFilter.some(pattern => action.type.match(pattern) ? true : false),
    });

    const middlewares = [
        thunkMiddleware,
        promiseMiddleware,
        historyMiddleware,
        verbose ? loggerMiddleware : null,
    ].filter(value => value);

    const finalMiddleware = applyMiddleware(...middlewares);

    const store = createStore(reducer, composeWithDevTools(finalMiddleware));

    return store;
};
