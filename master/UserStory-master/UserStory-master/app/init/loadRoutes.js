var config = require('../config/app');

module.exports = function (app, routes) {
  try {
    for (var key in routes) {
      app.use(config.api.baseUrl, routes[key]);
    }
  } catch (err) {
    throw new Error(err);
  }
}