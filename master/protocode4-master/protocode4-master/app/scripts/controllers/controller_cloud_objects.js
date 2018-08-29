/*
 templates/cloud_objects.hbs
 */
App.CloudObjectsController = Ember.ArrayController.extend(App.Saveable, {

    isCreating: false,
    objectName: Ember.computed('objectCount', function () {
        if (this.get('objectCount') !== 0) {
            return 'newObject' + this.get('objectCount');
        } else {
            return 'newObject';
        }
    }),
    objectCount: Ember.computed.alias('content.length'),

    // checks if the entity name is valid and doesn't already exists
    isNameValid: function () {

        var name = this.get('objectName');
        if (this.store.hasRecordForId('cloudObject', name)) {
            return false;

        } else if (name === '') {
            return false;

        } else return name.indexOf(' ') < 0;
    }.property('objectName'),

    actions: {

        setCreating: function (value) {
            this.set('isCreating', value);
        },

        createCloudObject: function () {

            var self = this;
            var name = this.get('objectName');

            if (!this.store.hasRecordForId('cloudObject', name)) {

                this.store.find('cloudHandler', 'cH1').then(
                    function (cloudHandler) {
                        self.store.createRecord('cloudObject', {

                            id: name,
                            name: name,
                            cloudHandler: cloudHandler

                        }).save().then(
                            function (cloudObject) {

                                cloudHandler.get('cloudObjects').addObject(cloudObject);
                                cloudHandler.save();
                                cloudObject.save();
                            });
                    });

                this.set('isCreating', false);
                this.transitionToRoute('cloud_objects');
                this.send('refreshModel');

                Ember.run.later(
                    function () {
                        self.send('redirectToObject');
                    }, 100);
            }
        }
    }
});
