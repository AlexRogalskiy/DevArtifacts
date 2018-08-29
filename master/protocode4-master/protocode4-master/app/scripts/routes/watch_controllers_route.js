App.WatchControllersRoute = Ember.Route.extend({
    init: function () {
        this._super();
        this.generateController('uiWatchControlTemplates', []).set('model', this.store.find('uiWatchControlTemplate'));
    },

    model: function () {
        return this.store.find('application', 'newAppId').then(function (app) {
            return app.get('watchControllers');
        });
    },

    actions: {

        refreshModel: function () {
            this.refresh();
        }
    }
});
