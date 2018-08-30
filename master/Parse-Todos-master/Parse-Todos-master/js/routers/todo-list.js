define([
  'backbone',
  'views/root',
  'views/todo-list/index',
  'views/todo-list/notloggedin'
], function(Backbone, RootView, TodoListIndexView, NotLoggedInView) {
  return Backbone.Router.extend({
    routes: {
      "": "index"
    },
    index: function() {

      Parse.initialize("REPLACE ME", "REPLACE ME");

      window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({
          appId      : 'REPLACE ME',                      
          cookie   : true,                              
          xfbml      : true                                  
        });

        loadViews();

      };

      if (typeof FB !== 'undefined') {

        Parse.FacebookUtils.init({
          appId      : 'REPLACE ME',                      
          cookie   : true,                              
          xfbml      : true                                  
        });

        loadViews();

      }

      function loadViews() {
        //Check for auth
        var currentUser = Parse.User.current();
        if (currentUser) {

          // Get Current User
          var user = Parse.User.current();

          // Todo Object
          var Todo = Parse.Object.extend('Todo');


          // Define Collection
          var TodoCollection = Parse.Collection.extend({
            model: Todo
          });

          var collection = new TodoCollection();

          // Grab Objects For User
          var TodoQuery = new Parse.Query(Todo);
          TodoQuery.equalTo("user", user);
          TodoQuery.find({
            success: function(results) {
              // Add Objects To Collection
              for (var i = 0; i < results.length; i++) { 
                var object = results[i];
                collection.add(object);
              }
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
                  
          var view = new TodoListIndexView({
            collection: collection
          });

          RootView.getInstance().setView(view);

        } else {

          var view = new NotLoggedInView;
          RootView.getInstance().setView(view);

        }
      }

    }
  });
}); 
