/*
 templates/storage_records.hbs
 */
App.StorageRecordsController = Ember.ArrayController.extend({

    isCreating: false,
    tempStorageRecord: false,
    extensionStorageRecord: 'text',
    extensions: ['text', 'img', 'other'],
    booleanOptions: ['true', 'false'],
    nameStorageRecord: Ember.computed('recordsCount', function () {
        if (this.get('recordsCount') !== 0) {
            return 'newFile' + this.get('recordsCount');
        } else {
            return 'newFile';
        }
    }),
    recordsCount: Ember.computed.alias('content.length'),

    // checks if the name already exists and if is a valid path
    isNameValid: function () {

        var name = this.get('nameStorageRecord');
        if (this.store.hasRecordForId('storageRecord', name)) {
            return false;

        } else if (name === '') {
            return false;

        } else return name.indexOf(' ') < 0;
    }.property('nameStorageRecord'),

    actions: {

        setCreating: function (value) {
            this.set('isCreating', value);
        },

        createStorageRecord: function () {

            var self = this;
            var name = this.get('nameStorageRecord');
            var tempFile = this.get('tempStorageRecord');
            var extension = this.get('extensionStorageRecord');

            if (!this.store.hasRecordForId('storageRecord', name)) {

                this.store.find('storageHandler', 'sH1').then(
                    function (storageHandler) {
                        self.store.createRecord('storageRecord', {

                            id: name,
                            name: name,
                            extension: extension,
                            tempFile: tempFile,
                            storageHandler: storageHandler

                        }).save().then(
                            function (storageRecord) {

                                storageHandler.get('storageRecords').addObject(storageRecord);
                                storageHandler.save();
                                storageRecord.save();
                            });
                    });

                this.set('isCreating', false);
                this.set('tempStorageRecord', false);
                this.set('extensionStorageRecord', 'text');
                this.send('refreshModel');
            }
        },

        deleteStorageRecord: function (name) {

            var self = this;

            this.store.find('storageHandler', 'sH1').then(
                function (storageHandler) {
                    self.store.find('storageRecord', name).then(
                        function (sRecord) {

                            sRecord.deleteRecord();
                            storageHandler.get('storageRecords').removeObject(sRecord);
                            storageHandler.save();
                            sRecord.save();
                        });
                });
        }
    }
});
