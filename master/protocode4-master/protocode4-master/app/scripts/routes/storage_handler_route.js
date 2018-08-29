/*
 templates/storage_handler.hbs
 */
App.StorageHandlerRoute = Ember.Route.extend({

    model: function () {

        return this.store.find('dataHandler', 'dH1').then(
            function (dataHandler) {
                return dataHandler.get('storageHandler');
            });
    },

    actions: {

        enableStorage: function () {

            var self = this;
            this.store.createRecord('storageHandler', {id: 'sH1'}).save().then(
                function (storageHandler) {
                    self.store.find('dataHandler', 'dH1').then(
                        function (dataHandler) {
                            dataHandler.set('storageHandler', storageHandler);
                            dataHandler.save();
                            storageHandler.save();
                        });
                });

            this.refresh();
            this.transitionTo('/data_model_editor/storage_handler/storage_records');
        },

        disableStorage: function () {

            var self = this;
            this.store.find('storageHandler', 'sH1').then(
                function (storageHandler) {

                    self.store.findAll('storageRecord').then(
                        function (array) {
                            array.forEach(function (data) {
                                Ember.run.once(self, function () {
                                    data.deleteRecord();
                                    data.save();
                                });
                            });
                        }
                    );

                    storageHandler.deleteRecord();
                    storageHandler.save();

                    self.store.find('dataHandler', 'dH1').then(
                        function (dataHandler) {
                            dataHandler.set('storageHandler', null);
                            dataHandler.save();
                        });
                }
            );

            this.refresh();
            this.transitionTo('/data_model_editor/storage_handler');
        }
    }
});
