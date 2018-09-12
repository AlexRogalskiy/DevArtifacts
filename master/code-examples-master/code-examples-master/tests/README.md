# Store - vanilla-store

A JavaScript storing library

[![Build Status](https://api.travis-ci.org/drublic/Store.svg)](http://travis-ci.org/drublic/Store)
[![Coverage Status](https://coveralls.io/repos/drublic/Store/badge.svg?branch=master)](https://coveralls.io/r/drublic/Store?branch=master)

## Install

    npm install --save vanilla-store

## API

    Store.create(String category, Array items|Object item);
    Store.update(String category, Array items|Object item);
    Store.get(String category, String id);
    Store.remove(String category, Array items|Object item);
    Store.clean(String category);
    Store.restore(String category, Array items);

## PubSub Events

`Store.create`, `Store.update, `Store.remove` and `Store.clean` all trigger
events with [PubSub](https://github.com/drublic/PubSub).
These events can be used to trigger actions based on the according events.

Calling `Store.create('Test', {…})` will trigger an event `Test.create`;
`Store.update('Test', {…})` will trigger `Test.update` and so on.

Just requesting data with `getAll`, `getAllByCategory` and `find` does not
publish events.

## Dependencies

If you want to store nested objects with Store please make sure to use a deep
object extend function. You can do so by providing a global `extend` function,
include jQuery or Lodash/Underscore.

## Tests

Please run `npm run test`. Tests are written utilizing Jasmine.

## License

MIT - 2015, Hans Christian Reinl
