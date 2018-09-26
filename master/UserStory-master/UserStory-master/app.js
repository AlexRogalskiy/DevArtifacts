var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('winston');

var config = require('./app/config/app');
var db = require('./app/db');
var loadRoutes = require('./app/init/loadRoutes');
//var tokenAuth = require('./app/middleware/tokenAuth');

// instantiate app
//var app = express();
//var io = require('socket.io');

// parse json and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// verbs such as PUT or DELETE
app.use(methodOverride());

app.use(function (req, res, next) {
  // try {
  //   throw new Error('Error my');
  // } catch (e) {
  //   logger.error(e);
  // }
  next();
});
// require routes
var routes = require('./app/routes');

// routes
loadRoutes(app, routes);

// socket.io
io.on('connection', function(client) {
  console.log('Client connected...');

  client.on('join', function(data) {
      console.log(data);
      client.emit('messages', 'Hello from server');
  });
});

// start server
server.listen(config.port, function (err) {
  // expose globals
  global.logger = logger;
  if (err) throw err;
  logger.info('Listening on port ' + config.port);
});

