// This is the path to the database... we don't want any configuration
// information in the main code folders, but we *do* want it in the
// repository for fast deployment.
module.exports = {
    'url'   : 'mongodb://127.0.0.1/database' // TODO: put the path to your database, such as 'mongodb://100.2.5.6/mydatabase'
};
