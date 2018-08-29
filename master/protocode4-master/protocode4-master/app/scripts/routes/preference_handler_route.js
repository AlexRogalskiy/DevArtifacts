/*
 templates/preference_handler.hbs
 */
App.PreferenceHandlerRoute = Ember.Route.extend({

    model: function () {

        return this.store.find('dataHandler', 'dH1').then(
            function (dataHandler) {
                return dataHandler.get('prefHandler');
            });
    },

    actions: {

        enableDP: function () {

            var self = this;
            this.store.createRecord('prefHandler', {id: 'pH1'}).save().then(
                function (prefHandler) {
                    self.store.find('dataHandler', 'dH1').then(
                        function (dataHandler) {
                            dataHandler.set('prefHandler', prefHandler);
                            dataHandler.save();
                            prefHandler.save();
                        });
                });

            this.refresh();
            this.transitionTo('/data_model_editor/preference_handler/preference_records');
        },

        disableDP: function () {

            var self = this;
            this.store.find('prefHandler', 'pH1').then(
                function (prefHandler) {

                    self.store.findAll('prefRecord').then(
                        function (array) {
                            array.forEach(function (data) {
                                Ember.run.once(self, function () {
                                    data.deleteRecord();
                                    data.save();
                                });
                            });
                        }
                    );

                    prefHandler.deleteRecord();
                    prefHandler.save();

                    self.store.find('dataHandler', 'dH1').then(
                        function (dataHandler) {
                            dataHandler.set('prefHandler', null);
                            dataHandler.save();
                        });
                }
            );

            this.refresh();
            this.transitionTo('/data_model_editor/preference_handler/');
        }
    }
});
