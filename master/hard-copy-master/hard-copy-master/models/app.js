/**
 * Our app.
 * @link http://expressjs.com/api.html
 * @link https://github.com/vol4ok/hogan-express
 */
define(['express', 'hogan-express', 'routeregister', 'routes'], function (express, hoganExpress, routeRegister, routes) {

    var app = express(),
        port = process.env.PORT || 5000;

    app.set('view engine', 'html');
    //app.enable('view cache');
    app.engine('html', hoganExpress);

    app.use(express.static('public'));
    app.use(express.cookieParser('some secret here'));
    app.use(express.session());
    app.use(express.bodyParser());

    app.configure(function() {
        app.use(express.logger({ format: ':method :url :status' }));
    });

    routeRegister(app, routes);

    /*app.get('/', function(request, response) {
        response.render('index', {test: "TEST"});
    });*/

    app.listen(port, function() {
        console.log("Listening on " + port);
    });

    return app;

});
