# binize

Invoke node functions defined into a file via command-line easily.


## Usage

Install:
```
yarn add binize
```

Require and apply:
```
const service = module.exports = {
    myFunction: async ({ key, anotherKey }) => {
        return [key, anotherKey];
    },
};

require('binize')(service);
```

Run:
```
node file.js myFunction --key value --anotherKey anotherValue
```
