var User = require('./user');

function run() {
    var john = new User('john');
    var mike = new User('mike');

    john.hello(mike);
};


if (module.parent) {
    exports.run = run;
} else {
    run();
}