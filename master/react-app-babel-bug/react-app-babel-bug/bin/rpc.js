const service = require('../api/rpc');

const bin = module.exports = {};
for(const key in service)
    bin[key] = service[key];

require('binize')(bin);