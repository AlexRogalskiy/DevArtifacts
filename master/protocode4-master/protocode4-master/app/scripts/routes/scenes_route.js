App.ScenesRoute = Ember.Route.extend({

    init: function () {
        this._super();
        this.generateController('uiPhoneControlTemplates', []).set('model', this.store.find('uiPhoneControlTemplate'));
    },

    model: function () {
        return this.store.find('application').then(function (app) {
            return app.get('content.0');
        });
    }
});
