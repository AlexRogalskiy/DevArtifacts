/*
  require all routes
*/

module.exports = {
  auth: require('./auth'),
  story: require('./story'),
  customer: require('./customer'),
  project: require('./project'),
}