var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

var names = [];

app.use(bodyParser.urlencoded({extended: true}));


// app.all('/', function(req, res, next){
//     console.log('all');
//     next();
// });

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});


app.get('/', function(req, res){
    res.render('index.jade', { names: names });
});


app.get('/name/:name', function(req, res){
    res.send('Your name is ' + req.params.name);
});


app.post('/', function(req, res){
    console.log(req.body);
    names.push(req.body.name);
    res.redirect('/');
});


app.listen(5000, function(){
    console.log('Server is running on port 5000.');
});