var intBower = require('./int-bower');
var template = require('./template');

module.exports = function( grunt ) {
  intBower( grunt );
  template( grunt );
};
