# react-update

Less verbose alternative to default `componentShouldUpdate`.

## Usage
`yarn add @damianobarbati/react-update`
```
import update from '@damianobarbati/react-update'
@update([path, path, path...]) //if any of this props changes then update component
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