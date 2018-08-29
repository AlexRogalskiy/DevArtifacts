App.PrefHandler = DS.Model.extend({

    dataHandler: DS.belongsTo('dataHandler'),

    prefRecords: DS.hasMany('prefRecord', {async: true}),

    xmlName: 'preferenceHandler',

    toXml: function (xmlDoc) {

        var self = this;
        var elem = xmlDoc.createElement(self.get('xmlName'));

        this.get('prefRecords').then(
            function (records) {
                records.map(
                    function (item) {
                        elem.appendChild(item.toXml(xmlDoc));
                    });
            });

        return elem;
    }
});
