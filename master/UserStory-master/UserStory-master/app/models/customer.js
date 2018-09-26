var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customValidator = [function (value) {
  return (value.length > 10 && value.length < 50);
}, 'String must be between 10 and 50'];

var CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: customValidator
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);