var http = require('http'),
    fs = require('fs');


http.createServer(function(req, res){

    var info;
    if (req.url == '/') {
        fs.readFile('hello.js', function(err, info) {
            if (err) {
                console.log(err);
                res.end('Error!');
            };
            
            res.end(info);
        });
    };


}).listen(3000);