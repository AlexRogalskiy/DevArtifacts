App.ObjectAttribute = DS.Model.extend({

    name: DS.attr('string'),
    type: DS.attr('string'),
    object: DS.attr('string'),

    cloudObject: DS.belongsTo('cloudObject'),

    xmlName: 'objectAttributes',

    toXml: function (xmlDoc) {

        var objAttribute = xmlDoc.createElement(this.get('xmlName'));

        objAttribute.setAttribute('name', this.get('name'));
        objAttribute.setAttribute('type', this.get('type'));

        if (!(this.get('object') === '')) {
            objAttribute.setAttribute('object', this.get('object'));
        }

        return objAttribute;
    }
});
