var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    paths: {
        app: "models/app"
    }
});

requirejs(['app']);