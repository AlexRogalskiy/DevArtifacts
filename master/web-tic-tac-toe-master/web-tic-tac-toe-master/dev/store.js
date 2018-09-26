import TicTacToeApp from './reducers/index';
import { createStore } from 'redux';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';

let store = createStore(TicTacToeApp, applyMiddleware(logger));

export default store;