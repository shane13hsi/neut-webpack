var defaultSpec = require('./defaultSpec');
var _assign = require('lodash/object/assign');
var devConfig = require('./dev.config');
var prodConfig = require('./prod.config');

module.exports = function(spec) {
  var finalSpec = _assign(defaultSpec, spec);
  if (finalSpec.dev) {
    return devConfig(finalSpec);
  }
  return prodConfig(finalSpec);
};
