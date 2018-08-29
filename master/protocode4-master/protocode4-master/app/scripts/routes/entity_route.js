/*
 templates/entity.hbs
 */
App.EntityRoute = Ember.Route.extend({

    model: function (params) {

        return this.store.find('entity', params.entity_id);
    },

    setupController: function (controller, model) {
        this._super(controller, model);
        controller.set('model', model);
        var otherEntities = [];

        this.store.findAll('entity').then(
            function (entities) {
                entities.forEach(function (entity) {
                    otherEntities.addObject(entity.get('name'));
                });
            });

        controller.set('destinations', otherEntities);
    }
});
