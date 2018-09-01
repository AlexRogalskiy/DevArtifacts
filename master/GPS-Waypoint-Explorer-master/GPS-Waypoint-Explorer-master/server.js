var path = require('path'),
    express = require('express'),
    nunjucks = require('express-nunjucks'),
    routes = require(__dirname + '/app/routes.js'),
    app = express(),
    bodyParser = require('body-parser'),
    config = require(__dirname + '/app/config.js'),
    port = (process.env.PORT || config.port),
    packageJson = require(__dirname + '/package.json'),
    env      = process.env.NODE_ENV || 'development';

env = env.toLowerCase();

// Application settings
app.set('view engine', 'html');
app.set('views', [__dirname + '/app/views', __dirname + '/lib/']);

nunjucks.setup({
  autoescape: true,
  watch: true,
  noCache: true
}, app);

// require core and custom filters, merges to one object
// and then add the methods to nunjucks env obj
nunjucks.ready(function(nj) {
  var coreFilters = require(__dirname + '/lib/core_filters.js')(nj),
    customFilters = require(__dirname + '/app/filters.js')(nj),
    filters = Object.assign(coreFilters, customFilters);
  Object.keys(filters).forEach(function(filterName) {
    nj.addFilter(filterName, filters[filterName]);
  });
});

// Middleware to serve static assets
app.use('/public', express.static(__dirname + '/public'));

// Support for parsing data in POSTs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// send assetPath to all views
app.use(function (req, res, next) {
  res.locals.asset_path="/public/";
  next();
});

// Add variables that are available in all views
app.use(function (req, res, next) {
  res.locals.serviceName=config.serviceName;
  res.locals.cookieText=config.cookieText;
  next();
});

// Disallow search index idexing
app.use(function (req, res, next) {
  // Setting headers stops pages being indexed even if indexed pages link to them.
  res.setHeader('X-Robots-Tag', 'noindex');
  next();
});

app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});

app.use("/", routes);

// Strip .html and .htm if provided
app.get(/\.html?$/i, function (req, res){
  var path = req.path;
  var parts = path.split('.');
  parts.pop();
  path = parts.join('.');
  res.redirect(path);
});

// auto render any view that exists
app.get(/^\/([^.]+)$/, function (req, res) {

  var path = (req.params[0]);

  res.render(path, function(err, html) {
    if (err) {
      res.render(path + "/index", function(err2, html) {
        if (err2) {
          console.log(err);
          res.status(404).send(err + "<br>" + err2);
        } else {
          res.end(html);
        }
      });
    } else {
      res.end(html);
    }
  });

});

app.listen(port);
