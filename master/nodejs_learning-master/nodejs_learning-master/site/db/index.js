var db = require('mongoose');
var config = require('../config');

db.connect(config.get('db:uri'));

module.exports = db;