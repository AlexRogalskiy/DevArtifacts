App.StorageRecord = DS.Model.extend({

    name: DS.attr('string'),
    extension: DS.attr('string'),
    tempFile: DS.attr('boolean', {defaultValue: false}),

    storageHandler: DS.belongsTo('storageHandler'),

    xmlName: 'storageRecords',

    toXml: function (xmlDoc) {

        var self = this;

        var record = xmlDoc.createElement(self.get('xmlName'));

        record.setAttribute('name', self.get('name'));
        record.setAttribute('extension', self.get('extension'));
        record.setAttribute('tempFile', self.get('tempFile'));

        return record;
    }

});
