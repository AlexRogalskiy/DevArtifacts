/*
 templates/entity.hbs
 */
App.EntityController = Ember.ObjectController.extend(App.Saveable, {

    isCreatingAttribute: false,
    isCreatingRelationship: false,
    isAttributeValid: true,
    isRelationshipValid: true,
    attributeType: 'String',
    relationshipDestination: '',
    relationshipType: '1 : N',
    types: ['String', 'Integer', 'Float', 'Double', 'Date', 'Boolean'],
    relTypes: ['1 : 1', '1 : N', 'N : 1'],
    attributeName: Ember.computed('attributeCount', function () {
        if (this.get('attributeCount') !== 0) {
            return 'newAttribute' + this.get('attributeCount');
        } else {
            return 'newAttribute';
        }
    }),
    attributeCount: Ember.computed.alias('content.entityAttributes.length'),
    relationshipName: Ember.computed('relationshipCount', function () {
        if (this.get('relationshipCount') !== 0) {
            return 'newRel' + this.get('relationshipCount');
        } else {
            return 'newRel';
        }
    }),
    relationshipCount: Ember.computed.alias('content.entityRelationships.length'),

    // checks if the destination entity has been set
    isDestinationValid: function () {

        var destination = this.get('relationshipDestination');

        if (!destination) {
            return false;

        } else if (destination === '') {
            return false;
        }

        return true;

    }.property('relationshipDestination'),

    // checks if the relationship name is valid and doesn't already exist for this entity
    isRelNameValid: function () {

        var self = this;
        var name = this.get('relationshipName');

        var entity = this.get('model');

        self.set('isRelationshipValid', true);

        this.store.all('entityRelationship').some(
            function (relationship) {

                if (relationship.get('name') === name) {
                    if (relationship.get('entity') === entity) {

                        self.set('isRelationshipValid', false);
                        return false;
                    }
                }
            }
        );

        if (!this.get('isRelationshipValid')) {
            return false;

        } else return name !== '';

    }.property('relationshipName'),

    // checks if the attribute name is valid and doesn't already exist for this entity
    isAttNameValid: function () {

        var self = this;
        var name = this.get('attributeName');
        var entity = this.get('model');
        var primary = entity.get('primaryKey');

        if (name === primary) {
            return false;
        }

        self.set('isAttributeValid', true);

        this.store.all('entityAttribute').some(
            function (attribute) {

                if (attribute.get('name') === name) {
                    if (attribute.get('entity') === entity) {

                        self.set('isAttributeValid', false);
                        return false;
                    }
                }
            }
        );

        if (!this.get('isAttributeValid')) {
            return false;

        } else return name !== '';
    }.property('attributeName'),

    actions: {

        deleteEntity: function (name) {

            var self = this;
            var model = this.get('model');
            var entityName = model.get('name');

            this.store.find('databaseHandler', 'dbH1').then(
                function (databaseHandler) {
                    self.store.find('entity', entityName).then(
                        function (entity) {

                            self.store.findAll('entityAttribute', {entity: model}).then(
                                function (array) {
                                    array.forEach(function (data) {
                                        Ember.run.once(self, function () {
                                            try{
                                                data.deleteRecord();
                                                data.save();
                                            }catch(exception){
                                                console.log("[ ERROR ] "+exception);
                                            }
                                        });
                                    });
                                }
                            );

                            self.store.findAll('entityRelationship', {entity: model}).then(
                                function (array) {
                                    array.forEach(function (data) {
                                        Ember.run.once(self, function () {
                                            try{
                                                data.deleteRecord();
                                                data.save();
                                            }catch(exception){
                                                console.log("[ ERROR ] "+exception);
                                            }
                                        });
                                    });
                                }
                            );

                            try{
                                entity.deleteRecord();
                                databaseHandler.get('entities').removeObject(entity);
                                databaseHandler.save();
                                entity.save();
                            }catch(exception){
                                console.log("[ ERROR ] "+exception);
                            }
                        });
                });

            this.transitionToRoute('entities');
        },

        setCreatingAttribute: function (value) {
            this.set('isCreatingAttribute', value);
            if (value === false) {
                this.set('attributeName', 'newAttribute' + this.get('attributeCount'));
                this.set('attributeType', 'string');
            }
        },

        setCreatingRelationship: function (value) {
            this.set('isCreatingRelationship', value);

            if (value === false) {
                this.set('relationshipName', 'newRel' + this.get('relationshipCount'));
                this.set('relationshipDestination', '');
                this.set('relationshipType', '1 : N');
            }
        },

        createAttribute: function () {

            var self = this;
            var name = this.get('attributeName');
            var type = this.get('attributeType');
            var entity = this.get('model');
            var entityName = entity.get('name');

            this.store.find('entity', entityName).then(
                function (entity) {
                    self.store.createRecord('entityAttribute', {

                        name: name,
                        type: type,
                        entity: entity

                    }).save().then(
                        function (attribute) {

                            entity.get('entityAttributes').addObject(attribute);
                            attribute.save();
                            entity.save();
                        });
                });
            this.set('attributeName', 'newAttribute' + (this.get('attributeCount') + 1));
            this.set('isCreatingAttribute', false);
            this.set('attributeType', 'string');
        },

        createRelationship: function () {

            var self = this;
            var name = this.get('relationshipName');
            var destination = this.get('relationshipDestination');
            var type = this.get('relationshipType');
            var entity = this.get('model');
            var entityName = entity.get('name');

            this.store.find('entity', entityName).then(
                function (entity) {
                    self.store.createRecord('entityRelationship', {

                        name: name,
                        destination: destination,
                        type: type,
                        entity: entity

                    }).save().then(
                        function (relationship) {

                            entity.get('entityRelationships').addObject(relationship);
                            entity.save();
                            relationship.save();
                        });
                }
            );

            /*var newType = type;
            if (this.get('relationshipType') === '1 : N') {
                newType = 'N : 1'
            }

            if (destination !== entityName) {
                this.store.find('entity', destination).then(
                    function (Nentity) {

                        var attributes = Nentity.get('entityAttributes');
                        console.log(attributes);
                        self.store.createRecord('entityRelationship', {

                            name: name,
                            destination: entityName,
                            type: newType,
                            entity: Nentity

                        }).save().then(
                            function (Nrelationship) {

                                var attributes = Nentity.get('entityAttributes');
                                console.log(attributes);
                                Nentity.get('entityRelationships').addObject(Nrelationship);
                                //Nentity.set('entityAttributes', attributes);
                                Nentity.save();
                                Nrelationship.save();
                            });
                    }
                );
            }*/
            this.set('relationshipName', 'newRel' + (this.get('relationshipCount') + 1));
            this.set('isCreatingRelationship', false);
            this.set('relationshipDestination', '');
            this.set('relationshipType', '1 : N');
        },

        deleteRelationship: function (key) {

            var self = this;
            var entity = this.get('model');
            var entityName = entity.get('name');

            this.store.find('entity', entityName).then(
                function (entity) {
                    self.store.find('entityRelationship', key).then(
                        function (relationship) {

                            var destination = relationship.get('destination');
                            try{
                                entity.get('entityRelationships').removeObject(relationship);
                                relationship.deleteRecord();
                                entity.save();
                                relationship.save();
                            }catch(exception){
                                console.log("[ ERROR ] "+exception);
                            }

                            /*self.store.find('entity', destination).then(
                                function (oppEntity) {

                                    self.store.find('entityRelationship', {destination: entityName}).then(
                                        function (oppRelationships) {

                                            oppRelationships.forEach(function (item) {

                                                if (item.get('entity') === oppEntity) {
                                                    try{
                                                        oppEntity.get('entityRelationships').removeObject(item);
                                                        item.deleteRecord();
                                                        item.save();
                                                    }catch(exception){
                                                        console.log("[ ERROR ] "+exception);
                                                    }
                                                }
                                            }, oppRelationships);
                                        });

                                    //oppEntity.set('entityAttributes', attributes);
                                    oppEntity.save();
                                });*/
                        });
                }
            );
            this.set('relationshipName', 'newRel' + (this.get('relationshipCount') - 1));
        },

        deleteAttribute: function (key) {

            var self = this;
            var entity = this.get('model');
            var entityName = entity.get('name');

            this.store.find('entity', entityName).then(
                function (entity) {
                    self.store.find('entityAttribute', key).then(
                        function (attribute) {
                            try{
                                attribute.deleteRecord();
                                entity.get('entityAttributes').removeObject(attribute);
                                entity.save();
                                attribute.save();
                            }catch(exception){
                                console.log("[ ERROR ] "+exception);
                            }
                        });
                }
            );
            this.set('attributeName', 'newAttribute' + (this.get('attributeCount') - 1));
        }
    }
});
