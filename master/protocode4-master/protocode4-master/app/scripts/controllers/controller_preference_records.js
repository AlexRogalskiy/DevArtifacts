/*
 templates/preference_records.hbs
 */
App.PreferenceRecordsController = Ember.ArrayController.extend({

    isCreating: false,
    valuePreferenceRecord: 'newStringValue',
    typePreferenceRecord: 'string',
    types: ['string', 'boolean', 'int', 'long', 'float', 'double'],
    booleanOptions: ['true', 'false'],
    keyPreferenceRecord: Ember.computed('recordsCount', function () {
        if (this.get('recordsCount') !== 0) {
            return 'newKey' + this.get('recordsCount');
        } else {
            return 'newKey';
        }
    }),
    recordsCount: Ember.computed.alias('content.length'),

    // sets the default value accordingly to the record type,
    // returns true if the type is boolean
    isBooleanRec: function () {

        var recordType = this.get('typePreferenceRecord');

        if (recordType === 'boolean') {
            this.set('valuePreferenceRecord', 'false');
            return true;

        } else if (recordType === 'string') {
            this.set('valuePreferenceRecord', 'newStringValue');
            return false;

        } else if (recordType === 'int') {
            this.set('valuePreferenceRecord', '0');
            return false;

        } else if (recordType === 'long') {
            this.set('valuePreferenceRecord', '0');
            return false;

        } else if (recordType === 'float') {
            this.set('valuePreferenceRecord', '0.0');
            return false;

        } else if (recordType === 'double') {
            this.set('valuePreferenceRecord', '0.0');
            return false;

        } else if (recordType === 'string') {
            this.set('valuePreferenceRecord', 'newStringValue');
            return false;

        } else {
            return false;
        }
    }.property('typePreferenceRecord'),

    // checks if the default value matches record type
    isValueValid: function () {

        var intReg = new RegExp('^[-+]?[0-9]*$');
        var floatReg = new RegExp('^[-+]?[0-9]*\.?[0-9]+$');
        var recordType = this.get('typePreferenceRecord');
        var recordValue = this.get('valuePreferenceRecord');

        if (recordType === 'int') {
            return recordValue.match(intReg);

        } else if (recordType === 'long') {
            return recordValue.match(intReg);

        } else if (recordType === 'float') {
            return recordValue.match(floatReg);

        } else if (recordType === 'double') {
            return recordValue.match(floatReg);

        } else {
            return true;
        }
    }.property('valuePreferenceRecord'),

    // checks if the key already exists and if is a valid value
    isKeyValid: function () {

        var key = this.get('keyPreferenceRecord');
        if (this.store.hasRecordForId('prefRecord', key)) {
            return false;

        } else if (key === '') {
            return false;

        } else return key.indexOf(' ') < 0;
    }.property('keyPreferenceRecord'),

    actions: {

        setCreating: function (value) {
            this.set('isCreating', value);
        },

        createPrefRecord: function () {

            var self = this;
            var key = this.get('keyPreferenceRecord');
            var value = this.get('valuePreferenceRecord');
            var type = this.get('typePreferenceRecord');

            if (!this.store.hasRecordForId('prefRecord', key)) {

                this.store.find('prefHandler', 'pH1').then(
                    function (prefHandler) {
                        self.store.createRecord('prefRecord', {

                            id: key,
                            key: key,
                            value: value,
                            type: type,
                            prefHandler: prefHandler

                        }).save().then(
                            function (prefRecord) {

                                prefHandler.get('prefRecords').addObject(prefRecord);
                                prefHandler.save();
                                prefRecord.save();
                            });
                    });

                this.set('isCreating', false);
                this.set('keyPreferenceRecord','newKey');
                this.set('valuePreferenceRecord', 'newStringValue');
                this.set('typePreferenceRecord', 'string');
                this.send('refreshModel');
            }
        },

        deletePrefRecord: function (key) {

            var self = this;

            this.store.find('prefHandler', 'pH1').then(
                function (prefHandler) {
                    self.store.find('prefRecord', key).then(
                        function (pRecord) {

                            pRecord.deleteRecord();
                            prefHandler.get('prefRecords').removeObject(pRecord);
                            prefHandler.save();
                            pRecord.save();
                        });
                });
        }
    }
});
