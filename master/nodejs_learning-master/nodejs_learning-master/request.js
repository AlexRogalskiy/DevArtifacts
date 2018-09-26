var url = require('url');
var debug = require('debug')('server:request');

module.exports = function(req, res) {
    //console.log(req.headers);
    debug("Got Request", req.method, req.url);

    var urlParsed = url.parse(req.url, true);  

    if ( urlParsed.pathname == '/echo' && urlParsed.query.message ) {
        debug( "Echo: " + urlParsed.query.message );
        res.end( urlParsed.query.message );
    } else {
        debug("Unkwon URL");
        res.statusCode = 404;
        res.end('incorrect query!');
    };
};