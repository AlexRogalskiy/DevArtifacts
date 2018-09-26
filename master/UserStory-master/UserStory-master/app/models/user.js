var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  firstName: String,
  lastName: String,

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function (next) {
  var self = this;

  bcrypt.hash(self.password, null, null, function (err, hash) {
    if (err) return next(err);
    self.password = hash;
    next();
  });
});


// custom method for compare passwords
UserSchema.methods.comparePassword = function (password) {
  var user = this;

  return bcrypt.compareSync(password, user.password);
};


module.exports = mongoose.model('User', UserSchema);