/*
 templates/cloud_object.hbs
 */
App.CloudObjectRoute = Ember.Route.extend({

    model: function (params) {

        return this.store.find('cloudObject', params.cloud_object_id);
    },

    setupController: function (controller, model) {
        this._super(controller, model);
        controller.set('model', model);
        var otherObjects = [];

        this.store.findAll('cloudObject').then(
            function (cloudObjects) {
                cloudObjects.forEach(function (cloudObject) {
                    otherObjects.addObject(cloudObject.get('name'));
                });
            });

        controller.set('cloudObjects', otherObjects);
    }
});
