App.ModelIndexRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('application', 1);
    }
});