/*
 templates/data_model_editor.hbs
 */
App.DataModelEditorController = Ember.ObjectController.extend({
    actions: {
        acceptChanges: function() {
            // load scenes and view controllers before save because they are async
            var self = this;
            this.get('model.application.scenes').then(function(ss) {
                self.get('model.application.viewControllers').then(function(vcs) {
                    self.get('model.application').save();
                });
            });
        }
    }
});
