App.ApplicationSerializer = DS.LSSerializer.extend({
    /**
     You can use this method to customize how polymorphic objects are serialized.
     By default the JSON Serializer creates the key by appending `Type` to
     the attribute and value from the model's camelcased model name.

     @method serializePolymorphicType
     @param {DS.Model} record
     @param {Object} json
     @param {Object} relationship
     */
    serializePolymorphicType: function (record, json, relationship) {
        var key = relationship.key,
            belongsTo = Ember.get(record, key);
        key = this.keyForAttribute ? this.keyForAttribute(key) : key;
        if (!Ember.isNone(belongsTo)) {
            json[key + "Type"] = belongsTo.constructor.typeKey;
        }
        else {
            json[key + "Type"] = belongsTo;
        }
    },

    serializeHasMany: function (record, json, relationship) {
        var key = relationship.key,
            relationshipType = DS.RelationshipChange.determineRelationshipType(record.constructor, relationship);

        if (relationshipType === 'manyToNone' ||
            relationshipType === 'manyToMany' ||
            relationshipType === 'manyToOne') {
            if (!relationship.options.polymorphic) {
                json[key] = record.get(key).mapBy('id');
            }
            else {
                json[key] = record.get(key).map(function (value) {
                    return {
                        id: value.get('id'),
                        type: value.constructor.typeKey
                    }
                });
            }

        }
    }

});

App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'protocode'
});
