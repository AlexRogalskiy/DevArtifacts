/*
 templates/view_controller/index.hbs
 */
App.ViewControllerIndexController = Ember.ObjectController.extend(App.Saveable, {

    currentRouteIsViewController: function() {
        var path = this.get('target.location.lastSetURL');
        if(!path) {
            path = this.get('target.url');
        }
        if(path) {
            var splittedPath = path.split('/');
            return splittedPath[3] === 'viewController';
        }
        return false;
    }.property(
        'target.location.lastSetURL'
    ),

    actions: {
        createAsyncTask: function (value) {
            var viewController = this.get('model');
            var asyncTask = this.store.createRecord('asyncTask', {
                viewController: viewController
            });
            asyncTask.save();
            viewController.save();
        },

        createAlertDialog: function (value) {
            var viewController = this.get('model');
            var alertDialog = this.store.createRecord('alertDialog', {
                viewController: viewController
            });
            alertDialog.save();
            viewController.save();
        },

        createProgressDialog: function (value) {
            var viewController = this.get('model');
            var progressDialog = this.store.createRecord('progressDialog', {
                viewController: viewController
            });
            progressDialog.save();
            viewController.save();
        },

        createChain: function() {
            var viewController = this.get('model');
            var controlChain = this.store.createRecord('controlChain', {
                viewController: viewController,
                axis: 'horizontal',
                type: 'spread',
                spacing: 0
            });
            controlChain.save();
            viewController.save();
            this.transitionToRoute('viewController.controlChain', controlChain);
        },

        deleteViewController: function () {
            if (confirm('Are you sure to delete this view controller?')) {
                var viewController = this.get('model');
                var id = viewController.get('id');
                this.store.find('viewController').then(function (viewControllers) {
                    viewControllers.without(viewController).forEach(function(vc) {
                        vc.updateNavigations(true, id);
                    });
                });

                this.store.find('container').then(function (containers) {
                    containers.forEach(function (container) {
                        if(container.get('childViewController') === null) {
                            container.deleteRecord();
                            container.save();
                        } else if(container.get('childViewController') === viewController) {
                            var parentVC = container.get('viewController');
                            parentVC.get('uiPhoneControls').removeObject(container);
                            parentVC.save().then(function(parentVC) {
                                container.deleteRecord();
                                container.save();
                            });
                        }
                    });
                });

                var app = viewController.get('application');
                app.get('viewControllers').removeObject(viewController);
                app.save().then(function(app) {
                    viewController.deleteRecord();
                    viewController.save();
                });

                this.transitionToRoute('scenes');
            }
        }

    }

});
