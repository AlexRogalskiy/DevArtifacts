var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    // data for local user accounts
    local            : {
        email        : String,
        password     : String,
    },
    // data for Google OAuth accounts
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// extend schema with methods to generate hash and check if password valid
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model and expose it to our app
module.exports = mongoose.model('User', userSchema);
