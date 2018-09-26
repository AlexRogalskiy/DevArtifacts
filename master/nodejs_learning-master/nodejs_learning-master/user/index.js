function User(name) {
    this.name = name;
};

User.prototype.hello = function (who) {
    console.log("Hello, " + who.name)
};


// local scope
//exports.User = User;

// global scope
//global.User = User;

//console.log(module);

module.exports = User;