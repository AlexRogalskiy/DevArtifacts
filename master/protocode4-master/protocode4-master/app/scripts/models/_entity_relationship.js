App.EntityRelationship = DS.Model.extend({

    name: DS.attr('string'),
    destination: DS.attr('string'),
    type: DS.attr('string'),

    entity: DS.belongsTo('entity'),

    xmlName: 'entityRelationships',

    toXml: function (xmlDoc) {

        var self = this;

        var entityRelationship = xmlDoc.createElement(self.get('xmlName'));

        entityRelationship.setAttribute('name', self.get('name'));
        entityRelationship.setAttribute('destination', self.get('destination'));
        entityRelationship.setAttribute('type', self.get('type'));

        return entityRelationship;
    }
});
