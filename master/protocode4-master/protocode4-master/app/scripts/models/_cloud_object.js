App.CloudObject = DS.Model.extend({

    name: DS.attr('string'),

    objectAttributes: DS.hasMany('objectAttribute', {async: true}),

    cloudHandler: DS.belongsTo('cloudHandler'),

    xmlName: 'cloudObjects',

    toXml: function (xmlDoc) {

        var cloudObject = xmlDoc.createElement(this.get('xmlName'));

        cloudObject.setAttribute('name', this.get('name'));

        this.get('objectAttributes').then(
            function (attributes) {
                attributes.map(function (item) {
                    cloudObject.appendChild(item.toXml(xmlDoc));
                });
            });

        return cloudObject;
    }
});
