var db = require('../db');
var crypto = require('crypto');


var schemaUser = new db.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },

    hash: {
        type: String,
        require: true
    },

    salt: {
        type: String,
        require: true
    },

    iterations: {
        type: Number,
        require: true
    },

    created: {
        type: Date,
        default: Date.now()
    }

});


schemaUser.virtual('password')
    .set(function (data) {
        //this.plainPassword = data;
        this.salt = Math.random().toString();
        this.iterations = parseInt((Math.random() * 100) + 1);
        this.hash = this.getHash(data); 
    })
    .get(function () {        
        return this.hash;
    });


schemaUser.methods.getHash = function (password) {
    var hash = crypto.createHmac('sha1', this.salt);

    for (var i = 0; i < this.iterations; i++)
        hash = hash.update(password);

    return hash.digest('hex');
};


schemaUser.methods.checkPassword = function (data) {
    return this.getHash(data) === this.hash
};


exports.User = db.model('User', schemaUser);


// var salt = Math.random().toString();
// var iterations = parseInt((Math.random() * 100) + 1);
// var pass = 'simple_password';

// function createHash(password, salt, iterations) {
//     var hash = crypto.createHmac('sha1', salt);
    
//     for (var i = 0; i < iterations; i++)
//         result = result.update(password);    
    
//     return result.digest('hex');
// }


// console.log(createHash(pass, salt, iterations));