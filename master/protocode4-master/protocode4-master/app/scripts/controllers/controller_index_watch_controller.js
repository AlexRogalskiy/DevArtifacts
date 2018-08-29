/*
 templates/watch_controller/index.hbs
 */
App.WatchControllerIndexController = Ember.ObjectController.extend(App.Saveable, {

    actions: {
        deleteWatchController: function () {
            if (confirm('Are you sure to delete this watch controller?')) {
                var watchController = this.get('model');
                var application = watchController.get('application');

                application.get('watchControllers').removeObject(watchController);
                application.save();

                this.store.find('watchNavigation').then(function (watchNavigations) {
                    watchNavigations.forEach(function (watchNavigation) {
                        if (watchNavigation.get('destination') === watchController) {
                            watchNavigation.set('destination', null);
                            watchNavigation.save();
                        }
                    });
                });

                watchController.deleteRecord();
                watchController.save();

                this.transitionToRoute('/editor/watchControllers');
            }
        }
    }

});
