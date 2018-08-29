App.DataHandler = DS.Model.extend({

    application: DS.belongsTo('application'),

    prefHandler: DS.belongsTo('prefHandler'),
    databaseHandler: DS.belongsTo('databaseHandler'),
    cloudHandler: DS.belongsTo('cloudHandler'),
    storageHandler: DS.belongsTo('storageHandler'),

    xmlName: 'dataHandler',

    toXml: function (xmlDoc) {

        var prefHandler = this.get('prefHandler');
        var databaseHandler = this.get('databaseHandler');
        var cloudHandler = this.get('cloudHandler');
        var storageHandler = this.get('storageHandler');

        var dataHandler = xmlDoc.createElement(this.get('xmlName'));

        if (prefHandler) {
            dataHandler.appendChild(prefHandler.toXml(xmlDoc));
        }

        if (databaseHandler) {
            dataHandler.appendChild(databaseHandler.toXml(xmlDoc));
        }

        if (cloudHandler) {
            dataHandler.appendChild(cloudHandler.toXml(xmlDoc));
        }

        if (storageHandler) {
            dataHandler.appendChild(storageHandler.toXml(xmlDoc));
        }

        return dataHandler;
    }

});
