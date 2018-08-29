App.StorageHandler = DS.Model.extend({

    dataHandler: DS.belongsTo('dataHandler'),

    storageRecords: DS.hasMany('storageRecord', {async: true}),

    xmlName: 'storageHandler',

    toXml: function (xmlDoc) {

        var storageHandler = xmlDoc.createElement(this.get('xmlName'));

        this.get('storageRecords').then(
            function (items) {
                items.map(
                    function (record) {
                        storageHandler.appendChild(record.toXml(xmlDoc));
                    });
            });

        return storageHandler;
    }
});
