App.Entity = DS.Model.extend({

    name: DS.attr('string'),

    primaryKey: DS.attr('string'),

    entityAttributes: DS.hasMany('entityAttribute', {async: true}),

    entityRelationships: DS.hasMany('entityRelationship', {async: true}),

    databaseHandler: DS.belongsTo('databaseHandler'),

    xmlName: 'entities',

    toXml: function (xmlDoc) {

        var entity = xmlDoc.createElement(this.get('xmlName'));

        entity.setAttribute('name', this.get('name'));

        entity.setAttribute('primaryKey', this.get('primaryKey'));

        this.get('entityAttributes').then(
            function (attributes) {
                attributes.map(function (item) {
                    entity.appendChild(item.toXml(xmlDoc));
                });
            });

        this.get('entityRelationships').then(
            function (relationships) {
                relationships.map(function (item) {
                    entity.appendChild(item.toXml(xmlDoc));
                });
            });

        return entity;
    }
});
