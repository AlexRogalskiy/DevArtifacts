/*
 templates/view_scenes.hbs
 */
App.ScenesController = Ember.ObjectController.extend(App.Saveable, {
    needs: ['uiPhoneControlTemplates', 'editor'],

    vcsCount: function() {
        return this.get('model.viewControllers.length');
    }.property('model.viewControllers.length'),

    newNameVC: function () {
        if (this.get('vcsCount') !== 0) {
            return 'newView' + this.get('vcsCount');
        } else {
            return 'newView';
        }
    }.property('vcsCount'),

    scenesCount: function() {
        return this.get('model.scenes.length');
    }.property('model.scenes.length'),

    newNameScene: function () {
        if (this.get('scenesCount') !== 0) {
            return 'newScene' + this.get('scenesCount');
        } else {
            return 'newScene';
        }
    }.property('scenesCount'),

    actions: {

        createViewController: function () {
            var name = this.get('newNameVC');
            var app = this.get('model');

            this.store.createRecord('viewController', {
                name: name,
                application: app,
                scene: null
            }).save().then(function (vc) {
                app.get('viewControllers').addObject(vc);
                app.save();
            });
        },

        createScene: function () {
            var name = this.get('newNameScene');
            var app = this.get('model');

            this.store.createRecord('scene', {
                name: name,
                application: app
            }).save().then(function (scene) {
                app.get('scenes').addObject(scene);
                app.save();
            });
        }
    }
});
