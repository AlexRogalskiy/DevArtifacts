const config = require('../package.json');

module.exports = {
    name: config.name,
    script: 'index.js',
    exec_mode: 'cluster',
    node_args: '--max_old_space_size=512 --harmony --trace-deprecation',
    max_memory_restart: '512M',
    max_restarts: 3,
    restart_delay: 3000,
    min_uptime: 3000,
    error_file: 'logs/error.log',
    out_file: 'logs/output.log',
    watch: ['package.json', 'index.js', 'config/', 'api/', 'services/', 'models/'],
    env_development: {
        NODE_ENV: 'development',
    },
    env_staging: {
        NODE_ENV: 'staging',
    },
    env_production: {
        NODE_ENV: 'production',
    }
};
