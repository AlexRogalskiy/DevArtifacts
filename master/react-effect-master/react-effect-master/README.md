# react-effect

*How do I watch a specific property change into redux store in order to fire a function?*
Problem solved.

## Usage
`yarn add @damianobarbati/react-effect`
```
import update from '@damianobarbati/react-effect';
@effect([{
    //watch propX changes
    path: 'myPropX',
    //then dispatch action
    then: (dispatch, previousValue, nextValue, previousProps, nextProps) => dispatch(myAction()),
}, {
    //watch propY changes
    path: 'myPropY',
    //and watch specific propY change
    when: (previousValue, nextValue, previousProps, nextProps) => previousValue < nextValue,
    //then call instance method
    then: function (dispatch, previousValue, nextValue, previousProps, nextProps) {
        this.instanceMethod();
    },
}, {
    //watch propZ and propJ changes (at least one of them)
    path: ['myPropZ', 'myPropJ'],
    //and watch for specific change
    when: (previousProps, nextProps) => previousProps.whatever > nextProps.whatever,
    //then dispatch action and call instance method
    then: function (dispatch, previousProps, nextProps) {
        dispatch(myAction());
        this.instanceMethod();
    },
    //fire in componentDidUpdate instead of componentWillReceiveProps
    afterUpdate: true,
}])
export default class MyComponent extends React.Component {
```

## Webpack
You are probably excluding modules imported from `node_modules` to `babel-loader` no-matter-what.
Truth is you should look for `jsnext:main` entry and compile `ESx` modules into your environment.
Easy as switching from:
```
rules: [{
    test: /\.(js|mjs)$/i,
    exclude: /node_modules/
    use: [{
        loader: 'babel-loader',
    }]
}]    
```
to this:
```
rules: [{
    test: /\.(js|mjs)$/i,
    exclude: filename => {
        if(!filename.includes('node_modules'))
            return false;
        const packageFile = filename.replace(/(.+node_modules\/)(@.+?\/)?(.+?\/)(?:.+)?/, '$1$2$3package.json');
        const pkg = require(packageFile);
        return !pkg['jsnext:main'];
    },
    use: [{
        loader: 'babel-loader',
    }]
}]
```