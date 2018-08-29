/*
 templates/scene/index.hbs
*/
App.SceneIndexController = Ember.ObjectController.extend(App.Saveable, {
    sceneTypesAll: [
        {type: 'singleVC', label: 'One VC per screen, without tab menu'},
        {type: 'singleVCTab', label: 'One VC per screen, with tab menu'},
        {type: 'multiVC', label: 'Composed (all VCs in the same screen)'}
    ],

    viewControllers: Ember.computed.alias('model.viewControllers'),

    addedViewController: null,

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

    currentDeviceIsSmartphone: function() {
        return this.get('model.application.device.type') === 'smartphone';
    }.property('model.application.device.type'),

    cantChangeHasMenu: function() {
        if(this.get('model.launcher')) {
            return true;
        }
        return false;
    }.property('model.launcher'),

    availableViewControllers: function() {
        var scene = this.get('model');
        if(!scene.get('isDeleted') && scene.get('application')) {
            return scene.get('application.viewControllers').filter(function(vc) {
                return !(scene.get('viewControllers').contains(vc));
            });
        }
        return null;
    }.property(
        'model.application.viewControllers.[]',
        'model.viewControllers.[]'
    ),

    typeSmartphoneIsComposed: function() {
        if(!this.get('model.isDeleted')) {
            return this.get('model.typeSmartphone') === "multiVC";
        }
        return false;
    }.property('model.typeSmartphone'),

    typeTabletIsComposed: function() {
        if(!this.get('model.isDeleted')) {
            return this.get('model.typeTablet') === "multiVC";
        }
        return false;
    }.property('model.typeTablet'),

    // USED by partial _invalid_report.hbs
    invalidReport: function() {
        if(!this.get('model.valid')) {
            return 'Scene is invalid since it has no view controllers.';
        }
        return null;
    }.property('model.valid'),
    // END partial _invalid_report.hbs

    imageSrc: function() {
        if(this.get('model') && this.get('currentDeviceIsSmartphone')) {
            if(this.get('model.typeSmartphone') === 'singleVC') {
                return "../img/gui/scene_type_1.jpg";
            } else if(this.get('model.typeSmartphone') === 'singleVCTab') {
                return "../img/gui/scene_type_2.jpg";
            } else {
                return "../img/gui/scene_type_3.jpg";
            }
        } else {
            if(this.get('model.typeTablet') === 'singleVC') {
                return "../img/gui/scene_type_1.jpg";
            } else if(this.get('model.typeTablet') === 'singleVCTab') {
                return "../img/gui/scene_type_2.jpg";
            } else {
                return "../img/gui/scene_type_3.jpg";
            }
        }
    }.property('currentDeviceIsSmartphone', 'model.typeSmartphone', 'model.typeTablet'),

    sceneTypes: function() {
        if(this.get('model') && this.get('model.viewControllers.length') < 2) {
            return [ {type: 'singleVC', label: 'One VC per screen, without tab menu'} ];
        }
        return this.get('sceneTypesAll');
    }.property('model.viewControllers.length'),

    typeObserver: function() {
        if(!this.get('model.isDeleted')) {
            if(this.get('model.viewControllers.length') < 2) {
                if(this.get('model.typeSmartphone') !== "singleVC") {
                    this.set('model.typeSmartphone', "singleVC");
                }
                if(this.get('model.typeTablet') !== "singleVC") {
                    this.set('model.typeTablet', "singleVC");
                }
                this.get('model').save();
            }
        }
    }.observes('model.viewControllers.length'),

    actions: {
        addViewController: function() {
            if(this.get('model') && this.get('addedViewController')) {
                var vc = this.get('addedViewController');
                var scene = this.get('model');
                this.store.createRecord('container', {
                    viewController: scene.get('parentVCSmartphone'),
                    childViewController: vc
                }).save().then(function(containerSmartphone) {
                    scene.get('parentVCSmartphone.uiPhoneControls').pushObject(containerSmartphone);
                    scene.get('parentVCSmartphone').save();
                });
                this.store.createRecord('container', {
                    viewController: scene.get('parentVCTablet'),
                    childViewController: vc
                }).save().then(function(containerTablet) {
                    scene.get('parentVCTablet.uiPhoneControls').pushObject(containerTablet);
                    scene.get('parentVCTablet').save();
                });
                // Create navigation object for viewController's controls with navigation
                vc.addNavigation(scene.get('id'));
            }
        },

        removeViewController: function(containerSmartphone) {
            if(this.get('model')) {
                var scene = this.get('model');
                var vc = containerSmartphone.get('childViewController');
                var index = scene.get('parentVCSmartphone.uiPhoneControls').indexOf(containerSmartphone);
                var containerTablet = scene.get('parentVCTablet.uiPhoneControls').objectAt(index);
                // Delete container in smartphone - cont is already the container for the removed vc in the parentVCSmartphone
                scene.get('parentVCSmartphone.uiPhoneControls').removeObject(containerSmartphone);
                scene.get('parentVCSmartphone').save().then(function(parentVCSmartphone) {
                    containerSmartphone.deleteFromScene();
                });
                // Delete container in tablet
                scene.get('parentVCTablet.uiPhoneControls').removeObject(containerTablet);
                scene.get('parentVCTablet').save().then(function(parentVCTablet) {
                    containerTablet.deleteFromScene();
                });
                // Delete navigation object for vc's controls with navigation
                vc.removeNavigation(scene.get('id'));
                // Update navigation objects of other view controllers' controls whose navigation pointed to the removed vc
                scene.updateNavigations(true, vc.get('id'));
            }
        },

        deleteScene: function () {
            if (confirm('Are you sure to delete this scene?')) {
                var scene = this.get('model');
                var id = scene.get('id');
                var self = this;
                this.store.find('viewController').then(function (viewControllers) {
                    viewControllers.forEach(function(vc) {
                        vc.updateNavigations(false, id);
                    });

                    var parentVCSmartphone = scene.get('parentVCSmartphone');
                    if(parentVCSmartphone) {
                        parentVCSmartphone.deleteRecord();
                        parentVCSmartphone.save();
                    }
                    var parentVCTablet = scene.get('parentVCTablet');
                    if(parentVCTablet) {
                        parentVCTablet.deleteRecord();
                        parentVCTablet.save();
                    }

                    var app = scene.get('application');
                    app.get('scenes').removeObject(scene);
                    app.save().then(function(app) {
                        scene.deleteRecord();
                        scene.save();
                    });

                    self.transitionToRoute('scenes');
                });
            }
        }
    }

});
