require('./style.css');

import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import StatefulTicTacToe from './containers/statefultictactoe';
import { Provider } from 'react-redux'

ReactDOM.render(
    <Provider store={store}>
        <StatefulTicTacToe player="X" />
    </Provider>,
    document.getElementById('root')
);