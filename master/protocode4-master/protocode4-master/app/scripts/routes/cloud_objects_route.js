/*
 templates/cloud_objects.hbs
 */
App.CloudObjectsRoute = Ember.Route.extend({

    model: function () {

        return this.store.find('cloudHandler', 'cH1').then(
            function (cloudHandler) {

                return cloudHandler.get('cloudObjects');
            }
        );
    },

    actions: {

        refreshModel: function () {
            this.refresh();
        },

        redirectToObject: function () {
            this.transitionTo('cloud_object', this.modelFor('cloud_objects').get('lastObject'));
        }
    }
});
