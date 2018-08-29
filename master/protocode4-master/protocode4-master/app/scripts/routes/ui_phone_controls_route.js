App.UiPhoneControlsRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('uiPhoneControl');
    }
});
