function couchapp_load(scripts) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>')
  };
};

couchapp_load([
  "http://cdnjs.cloudflare.com/ajax/libs/handlebars.js \
    /3.0.3/handlebars.min.js",
  "http://ajax.googleapis.com/ajax/libs/jquery/2.1.4 \
    /jquery.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery-browser \
    /0.0.7/jquery.browser.min.js",
  "js/lib/jquery.couch.js"
]);
