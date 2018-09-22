var express = require('express'),
	app = express();

app.set('port', process.env.PORT || 5000);

// initialize view engine
app.engine('handlebars', require('express3-handlebars')({
	defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

// static resources
app.use(express.static(require('path').join(__dirname, 'public')));

// auto views
var autoviews = (function(app) {
	var fs = require('fs'),
		path = require('path'),
		views = {};
	return function(req, res, next) {
		if(!views[req.path]) {
			var name1 = req.path.replace(/^\//, '');
			var name2 = (name1 + '/index').replace(/^\//, '');
			var ext = '.' + app.get('view engine');
			var base = path.join(app.get('views'), req.path.replace('/', path.sep));
			var fname1 = base + ext;
			var fname2 = path.join(base, 'index' + ext);
			if(name1 && fs.existsSync(fname1)) views[req.path] = name1;
			else if(fs.existsSync(fname2)) views[req.path] = name2;
		}
		if(views[req.path]) res.render(views[req.path]);
		else next();
	};
});
app.use(autoviews(app));

// 404
app.use(function(req, res) {
	return res.status(404).render('404');
});

// 500
app.use(function(err, req, res, next) {
	console.error(err.stack);
	return res.status(500).render('500');
});

app.listen(app.get('port'), function() {
	console.log('robot listening on port ' + app.get('port'));
});
