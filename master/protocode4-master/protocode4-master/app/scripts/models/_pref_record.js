App.PrefRecord = DS.Model.extend({

    key: DS.attr('string'),
    value: DS.attr('string'),
    type: DS.attr('string', {defaultValue: 'string'}),

    prefHandler: DS.belongsTo('prefHandler'),

    xmlName: 'preferenceRecords',

    toXml: function (xmlDoc) {

        var self = this;

        var record = xmlDoc.createElement(self.get('xmlName'));

        record.setAttribute('key', self.get('key'));
        record.setAttribute('value', self.get('value'));
        record.setAttribute('type', self.get('type'));

        return record;
    }

});
