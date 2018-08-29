App.EntityAttribute = DS.Model.extend({

    name: DS.attr('string'),
    type: DS.attr('string'),

    entity: DS.belongsTo('entity'),

    xmlName: 'entityAttributes',

    toXml: function (xmlDoc) {

        var self = this;

        var entityAttribute = xmlDoc.createElement(self.get('xmlName'));

        entityAttribute.setAttribute('name', self.get('name'));
        entityAttribute.setAttribute('type', self.get('type'));

        return entityAttribute;
    }
});
