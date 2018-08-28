// connect to the database
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

// set up express with full logging, cookies (for passport), ejs, and bodyparser
var express      = require('express');
var app          = express();
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static('public')); // serve public folder statically

// passport configuration
var passport = require('passport');
var flash    = require('connect-flash');
var session  = require('express-session');
require('./app/passport')(passport);
app.use(session({ secret: 'bigasux'}));
// externalize ^^^
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// load routes
require('./app/routes.js')(app, passport); 

// launch server
var port = process.env.PORT || 8080;
app.listen(port);
console.log('listening on ' + port);
