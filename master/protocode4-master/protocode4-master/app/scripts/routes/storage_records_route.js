/*
 templates/storage_records.hbs
 */
App.StorageRecordsRoute = Ember.Route.extend({

    model: function () {

        return this.store.find('storageHandler', 'sH1').then(
            function (storageHandler) {
                return storageHandler.get('storageRecords');

            });
    },

    actions: {

        refreshModel: function () {
            this.refresh();
        }
    }
});
