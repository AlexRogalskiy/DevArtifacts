/*
 templates/database_handler.hbs
 */
App.DatabaseHandlerRoute = Ember.Route.extend({

    model: function () {

        try {
            return this.store.find('dataHandler', 'dH1').then(
                function (dataHandler) {

                    return dataHandler.get('databaseHandler');
                });
        } catch (exception) {
            console.log("[ ERROR ] "+exception);
        }

    },

    actions: {

        enableDB: function () {

            var self = this;
            this.store.createRecord('databaseHandler', {id: 'dbH1'}).save().then(
                function (dbHandler) {
                    self.store.find('dataHandler', 'dH1').then(
                        function (dataHandler) {
                            dataHandler.set('databaseHandler', dbHandler);
                            dataHandler.save();
                            dbHandler.save();
                        });
                });

            this.refresh();
            this.transitionTo('/data_model_editor/database_handler/entities');
        },

        disableDB: function () {

            var self = this;

            this.store.find('databaseHandler', 'dbH1').then(
                function (dbHandler) {

                    self.store.findAll('entity').then(
                        function (array) {
                            array.forEach(function (data) {
                                Ember.run.once(self, function () {
                                    try{
                                        data.deleteRecord();
                                        data.save();
                                    }catch(exception){
                                        console.log("[ ERROR ] "+exception);
                                    }
                                });
                            });
                        }
                    );
                    self.store.findAll('entityAttribute').then(
                        function (array) {
                            array.forEach(function (data) {
                                Ember.run.once(self, function () {
                                    try{
                                        data.deleteRecord();
                                        data.save();
                                    }catch(exception){
                                        console.log("[ ERROR ] "+exception);
                                    }
                                });
                            });
                        }
                    );

                    self.store.findAll('entityRelationship').then(
                        function (array) {
                            array.forEach(function (data) {
                                Ember.run.once(self, function () {
                                    try{
                                        data.deleteRecord();
                                        data.save();
                                    }catch(exception){
                                        console.log("[ ERROR ] "+exception);
                                    }
                                });
                            });
                        }
                    );
                    dbHandler.deleteRecord();
                    dbHandler.save();

                    self.store.find('dataHandler', 'dH1').then(
                        function (dataHandler) {
                            dataHandler.set('databaseHandler', null);
                            dataHandler.save();
                        });
                }
            );

            this.refresh();
            this.transitionTo('/data_model_editor/database_handler/');
        }
    }
});
