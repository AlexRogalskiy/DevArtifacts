/*
 templates/watch_controllers.hbs
 */
App.WatchControllersController = Ember.ArrayController.extend(App.Saveable, {

    isCreating: false,
    newNameWatchController: Ember.computed('watchContrCount', function () {
        if (this.get('watchContrCount') !== 0) {
            return 'newWatchView' + this.get('watchContrCount');
        } else {
            return 'newWatchView';
        }
    }),
    watchContrCount: Ember.computed.alias('content.length'),
    needs: ['uiWatchControlTemplates', 'editor'],

    actions: {
        setCreating: function (value) {
            if (this.get('viewContrCount') !== 0) {
                this.set('newNameViewController', 'newWatchView' + this.get('viewContrCount'));
            } else {
                this.set('newNameViewController', 'newWatchView');
            }
            this.set('isCreating', value);
        },

        createWatchController: function () {

            var name = this.get('newNameWatchController');
            var app = this.get('controllers.editor.model');

            if (!name.trim()) {
                return;
            }

            // Application model is in editor.model
            this.store.createRecord('watchController', {
                name: name,
                application: app
            }).save().then(function (watchController) {
                app.get('watchControllers').addObject(watchController);
                app.save();
            });

            if (this.get('viewContrCount') !== 0) {
                this.set('newNameViewController', 'newWatchView' + this.get('viewContrCount'));
            } else {
                this.set('newNameViewController', 'newWatchView');
            }
            this.set('isCreating', false);
            this.send('refreshModel');
        }
    }
});
