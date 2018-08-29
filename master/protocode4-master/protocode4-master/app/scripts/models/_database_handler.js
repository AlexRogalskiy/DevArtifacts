App.DatabaseHandler = DS.Model.extend({

    dataHandler: DS.belongsTo('dataHandler'),

    entities: DS.hasMany('entity', {async: true}),

    xmlName: 'databaseHandler',

    toXml: function (xmlDoc) {

        var dbHandler = xmlDoc.createElement(this.get('xmlName'));

        this.get('entities').then(
            function (items) {
                items.map(
                    function (entity) {
                        dbHandler.appendChild(entity.toXml(xmlDoc));
                    });
            });

        return dbHandler;
    }
});
