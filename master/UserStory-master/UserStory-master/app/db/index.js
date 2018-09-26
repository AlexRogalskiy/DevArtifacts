var dbConfig = require('../config/db');
var mongoose = require('mongoose');
// mongoose Promise implementation don't support catch function, need to use bluebird library
mongoose.Promise = require('bluebird');
// enable debug mode
mongoose.set('debug', true);

// connect to the database
module.exports = mongoose.connect(dbConfig.url, function (err) {
  if (err) {
    logger.error(err);
  } else {
    logger.info('Connected to the database');
  }
});