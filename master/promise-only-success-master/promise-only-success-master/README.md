# promise-only-success
Helps to call promise till success.

## Usage

You should call function and pass at least function which return value is Promise.
```js
  var onlySuccess = require('./index.js');
  
  onlySuccess(pFunc, 3, ['hooray']);
  
```
| Parameter  |Description | Type | Default value |
| ------------- | ------------- | ------------- |------------- |
| pFunction  |function which should be called till success |Function|null  |
| times  | max amount of calls |Integer|10  |
| params  | arguments which should be passed into function |Array|[]|
