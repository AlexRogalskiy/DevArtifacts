define([
  'view',
  'templates/todo-list/notloggedin'
], function(View, template) {
  return View.extend({
    name: "todo-list/notloggedin",
    template: template,
    events: {
      // Login
      'click button.login': function(event) {
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            if (!user.existed()) {
              console.log("User signed up and logged in through Facebook!");
              Backbone.history.loadUrl();
            } else {
              console.log("User logged in through Facebook!");
              Backbone.history.loadUrl();
            }
          },
          error: function(user, error) {
            console.log("User cancelled the Facebook login or did not fully authorize.");
            Backbone.history.loadUrl();
          }
        });
      }
    }
  });
});

