/*
 templates/alert_dialog/index.hbs
 templates/progress_dialog/index.hbs
 */
App.DialogIndexController = Ember.ObjectController.extend(App.Saveable, App.Deletable, {
    actions: {
        delete: function () {
            var viewController = this.get('viewController');
            this._super();
            viewController.save();
        }
    }
});
