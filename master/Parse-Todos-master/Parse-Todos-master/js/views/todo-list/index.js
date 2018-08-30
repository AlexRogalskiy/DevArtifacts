define([
  'view',
  'templates/todo-list/index'
], function(View, template) {
  return View.extend({ 
    name: "todo-list/index", 
    template: template,
    events: { 
      // Add Todo
      "submit form": function(event) { 
        event.preventDefault();
        var attrs = this.serialize();
        attrs['user'] = Parse.User.current();
        this.collection.create(attrs);
        this.$('input[name="title"]').val(''); 
      },
      // Mark Todo Done/Un-Mark Todo Done
      'change input[type="checkbox"]': function(event) {
        var modelID = $(event.target).closest('[data-model-cid]').attr('data-model-cid'); 
        var model = this.collection.getByCid(modelID); 
        model.set({done: event.target.checked}).save();
      }, 
      // Logout
      'click button.logout': function(event) {
        Parse.User.logOut();
        Backbone.history.loadUrl();
      },
      // Delete Todo
      'click a.trash': function(event) {
        var modelID = $(event.target).closest('[data-model-cid]').attr('data-model-cid'); 
        var model = this.collection.getByCid(modelID); 
        model.destroy();
      }
    }
  });
});