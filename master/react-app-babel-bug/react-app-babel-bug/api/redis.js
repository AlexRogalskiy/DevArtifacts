const pkg = require('../package');
const Redis = require('ioredis');

const redisConfig = pkg.redis ? (pkg.redis || pkg.redis[process.env.NODE_ENV]) : null;

const cluster = Array.isArray(redisConfig);
const redis = !cluster ? new Redis(redisConfig) : new Redis.Cluster(redisConfig)

module.exports = redis;