/*
 templates/entities.hbs
 */
App.EntitiesRoute = Ember.Route.extend({

    model: function () {

        return this.store.find('databaseHandler', 'dbH1').then(
            function (databaseHandler) {

                return databaseHandler.get('entities');
            }
        );
    },

    actions: {

        refreshModel: function () {
            this.refresh();
        },

        redirectToEntity: function () {
            this.transitionTo('entity', this.modelFor('entities').get('lastObject'));
        }
    }
});
