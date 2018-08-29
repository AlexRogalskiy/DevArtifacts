App.CloudHandler = DS.Model.extend({

    dataHandler: DS.belongsTo('dataHandler'),

    cloudObjects: DS.hasMany('cloudObject', {async: true}),

    xmlName: 'cloudHandler',

    toXml: function (xmlDoc) {

        var cloudHandler = xmlDoc.createElement(this.get('xmlName'));

        this.get('cloudObjects').then(
            function (items) {
                items.map(
                    function (cloudObject) {
                        cloudHandler.appendChild(cloudObject.toXml(xmlDoc));
                    });
            });

        return cloudHandler;
    }
});
