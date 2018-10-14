import React from 'react';
import ReactDOM from 'react-dom';

import Component1 from './Component1';
import Component2 from './Component2';

ReactDOM.render(
    <React.Fragment>
        <Component1 greeting={'hola'} />
        <Component2 greeting={'hello'} />
    </React.Fragment>
, document.getElementById('app'));