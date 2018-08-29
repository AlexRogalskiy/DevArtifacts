/*
 templates/cloud_handler.hbs
 */
App.CloudHandlerRoute = Ember.Route.extend({

    model: function () {

        return this.store.find('dataHandler', 'dH1').then(
            function (dataHandler) {
                return dataHandler.get('cloudHandler');

            });
    },

    actions: {

        enableCDB: function () {

            var self = this;
            this.store.createRecord('cloudHandler', {id: 'cH1'}).save().then(
                function (cloudHandler) {
                    self.store.find('dataHandler', 'dH1').then(
                        function (dataHandler) {
                            dataHandler.set('cloudHandler', cloudHandler);
                            dataHandler.save();
                            cloudHandler.save();
                        });
                });

            this.refresh();
            this.transitionTo('/data_model_editor/cloud_handler/cloud_objects');
        },

        disableCDB: function () {

            var self = this;

            this.store.find('cloudHandler', 'cH1').then(
                function (cloudHandler) {

                    self.store.findAll('cloudObject').then(
                        function (array) {
                            array.forEach(function (data) {
                                Ember.run.once(self, function () {
                                    data.deleteRecord();
                                    data.save();
                                });
                            });
                        }
                    );

                    self.store.findAll('objectAttribute').then(
                        function (array) {
                            array.forEach(function (data) {
                                Ember.run.once(self, function () {
                                    data.deleteRecord();
                                    data.save();
                                });
                            });
                        }
                    );

                    cloudHandler.deleteRecord();
                    cloudHandler.save();
                }
            );

            self.store.find('dataHandler', 'dH1').then(
                function (dataHandler) {
                    dataHandler.set('cloudHandler', null);
                    dataHandler.save();
                });


            this.refresh();
            this.transitionTo('/data_model_editor/cloud_handler/');
        }
    }
});
