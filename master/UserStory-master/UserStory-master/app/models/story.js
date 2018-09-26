var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var StorySchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  body: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema);