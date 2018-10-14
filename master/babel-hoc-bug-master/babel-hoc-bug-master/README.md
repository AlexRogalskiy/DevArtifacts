# babel-hoc-bug

## Usage
```
$ git clone git@github.com:damianobarbati/babel-hoc-bug.git
$ cd babel-hoc-bug && npm install
$ node --harmony --trace-deprecation index.mjs # in first terminal
$ NODE_ENV=development yarn webpack --config ./webpack.config.js --progress --watch --mode development # in second terminal
```

## What happens?
In console you can see a warning:
```
Warning: Failed prop type: The prop `hocValue` is marked as required in `WithHOC2`, but its value is `undefined`.
```

But WithHOC2 (defined in HOC2) is not expecting that prop.
The enhanced component Component2 is expecting it.