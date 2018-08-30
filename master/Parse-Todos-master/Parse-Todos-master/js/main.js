require([
  'jquery',
  'backbone',
  'http://www.parsecdn.com/js/parse-1.2.12.min.js',
  '//connect.facebook.net/en_US/all.js',
  'views/root',
  'routers/todo-list'
], function ($, Backbone, Parse, FB, RootView, TodoListRouter ) {
  
  initialize(function(next) {
    // Load any data that your app requires to boot
    // and initialize all routers here, the callback
    // `next` is provided in case the operations
    // needed are aysynchronous

    new TodoListRouter;

    next();
  });

  function initialize(complete) {
    $(function() {
      Backbone.history.start({
        pushState: false,
        root: '/',
        silent: true
      });

      RootView.getInstance(document.body);

      // RootView may use link or url helpers which
      // depend on Backbone history being setup
      // so need to wait to loadUrl() (which will)
      // actually execute the route

      complete(function() {
        Backbone.history.loadUrl();
      });
    });
  }

});
