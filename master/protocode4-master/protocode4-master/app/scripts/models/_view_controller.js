App.ViewController = DS.Model.extend({
    name: DS.attr('string'),
    backgroundColor: DS.attr('string', {defaultValue: '#ffffff'}),
    backgroundImage: DS.attr('string', {defaultValue: ''}),

    // For parent view controllers
    scene: DS.belongsTo('scene', {inverse: null, defaultValue: null}),
    isParent: DS.attr('boolean', {defaultValue: false}),

    application: DS.belongsTo('application', {inverse: 'viewControllers'}),

    uiPhoneControls: DS.hasMany('uiPhoneControl', {inverse: 'viewController', polymorphic: true}),
    controlChains: DS.hasMany('controlChain', {inverse: 'viewController'}),
    alertDialogs: DS.hasMany('alertDialog', {inverse: 'viewController'}),
    progressDialogs: DS.hasMany('progressDialog', {inverse: 'viewController'}),
    asyncTasks: DS.hasMany('asyncTask', {inverse: 'viewController'}),

    activeScene: null,
    activeContainer: null,
    xmlName: 'viewControllers',
    xmlNameParent: 'parentViewControllers',

    uiPhoneControlsToShow: function() {
        if(this.get('activeScene') && this.get('activeScene.isNotComposed')) {
            return this.get('uiPhoneControls').filter(function(upc) {
                return upc.constructor.toString() !== 'App.Container';
            });
        }
        return this.get('uiPhoneControls');
    }.property(
        'activeScene',
        'activeScene.isNotComposed',
        'uiPhoneControls.[]'
    ),

    containers: function() {
        return this.get('uiPhoneControls').filter(function(upc) {
            return upc.constructor.toString() === 'App.Container';
        });
    }.property(
        'uiPhoneControls.[]'
    ),

    /*horizontalMinimumSpace: function() {
        var minimumSpace = 0;
        this.get('controlChains').forEach(function(chain) {
            if(chain.get('axis') === 'horizontal') {
                var space = chain.getHorizontalSpaceForControls();
                if(space > minimumSpace) {
                    minimumSpace = space;
                }
            }
        });
        this.get('uiPhoneControls').then(function(controls) {
            controls.forEach(function(control) {

            });
        });
        return minimumSpace;
    }.property(
        'controlChains.@each',
        'uiPhoneControls.@each'
    ),*/

    start: function() {
        if(this.get('activeContainer')) {
            return this.get('activeContainer.start');
        }
        return 0;
    }.property(
        'activeContainer',
        'activeContainer.start'
    ),

    end: function() {
        if(this.get('activeContainer')) {
            return this.get('activeContainer.end');
        }
        return this.get('application.device.screenWidth');
    }.property(
        'activeContainer',
        'activeContainer.end',
        'application.device.screenWidth'
    ),

    top: function() {
        if(this.get('activeContainer')) {
            return this.get('activeContainer.top');
        }
        if(this.get('activeScene')) {
            if(this.get('application.device.platform') === 'android') {
                if(this.get('activeScene.mustShowTabMenu')) {
                    return this.get('application.device.viewTop') + 48;
                }
            }
        }
        if(this.get('application.device.platform') === 'android' && this.get('application.device.type') === 'smartphone') {
            return this.get('application.device.viewTop');
        }
        return this.get('application.device.viewTop') - 1;
    }.property(
        'activeContainer',
        'activeContainer.top',
        'application.device.type',
        'activeScene',
        'activeScene.mustShowTabMenu',
        'application.device.platform',
        'application.device.viewTop'
    ),

    bottom: function() {
        if(this.get('activeContainer')) {
            return this.get('activeContainer.bottom');
        }
        if(this.get('activeScene')) {
            if(this.get('application.device.platform') === 'ios') {
                if(this.get('activeScene.mustShowTabMenu')) {
                    return this.get('application.device.viewBottom') - 48;
                }
            }
        }
        return this.get('application.device.viewBottom');
    }.property(
        'activeContainer',
        'activeContainer.bottom',
        'application.device.type',
        'activeScene',
        'activeScene.mustShowTabMenu',
        'application.device.platform',
        'application.device.viewBottom'
    ),

    width: function() {
        if(this.get('activeContainer')) {
            return this.get('activeContainer.width');
        }
        return this.get('end') - this.get('start');
    }.property(
        'activeContainer',
        'activeContainer.width',
        'start',
        'end'
    ),

    height: function() {
        if(this.get('activeContainer')) {
            return this.get('activeContainer.height');
        }
        return this.get('bottom') - this.get('top');
    }.property(
        'activeContainer',
        'activeContainer.height',
        'top',
        'bottom'
    ),

    centerX: function() {
        if(this.get('activeContainer')) {
            return this.get('activeContainer.centerX');
        }
        return (this.get('start') + (this.get('width') / 2));
    }.property(
        'activeContainer',
        'activeContainer.centerX',
        'start',
        'width'
    ),

    centerY: function() {
        if(this.get('activeContainer')) {
            return this.get('activeContainer.centerY');
        }
        return (this.get('top') + (this.get('height') / 2));
    }.property(
        'activeContainer',
        'activeContainer.centerY',
        'top',
        'height'
    ),

    hasBackButton: function() {
        if(this.get('activeScene')) {
            if(this.get('activeScene.hasMenu')) {
                return false;
            } else {
                return !this.get('activeScene.launcher');
            }
        }
        return false;
    }.property(
        'activeScene',
        'activeScene.hasMenu',
        'activeScene.launcher'
    ),

    addNavigation: function(id) {
        this.get('uiPhoneControls').forEach(function(upc) {
            var hasNavigations = upc.constructor.toString() === 'App.Button';
            hasNavigations = hasNavigations || upc.constructor.toString() === 'App.GridView';
            hasNavigations = hasNavigations || upc.constructor.toString() === 'App.ListView';
            if(hasNavigations) {
                upc.addNavigation(id);
            }
        });
    },

    removeNavigation: function(id) {
        this.get('uiPhoneControls').forEach(function(upc) {
            var hasNavigations = upc.constructor.toString() === 'App.Button';
            hasNavigations = hasNavigations || upc.constructor.toString() === 'App.GridView';
            hasNavigations = hasNavigations || upc.constructor.toString() === 'App.ListView';
            if(hasNavigations) {
                upc.removeNavigation(id);
            }
        });
    },

    updateNavigations: function(isVC, removedItemId) {
        this.get('uiPhoneControls').forEach(function(upc) {
            upc.updateNavigations(isVC, removedItemId);
        });
    },

    getWidthFromPercent: function(widthPercent) {
        return widthPercent * this.get('width');
    },

    getHeightFromPercent: function(heightPercent) {
        return heightPercent * this.get('height');
    },

    deleteRecord: function () {
        var self = this;

        // Delete uiPhoneControls not in control chains
        // The uiPhoneControls in chains will be deleted by the chains themselves
        this.get('uiPhoneControls').filter(function(upc) {
            return upc.get('controlChain') === null;
        }).forEach(function (uiPhoneControl) {
            Ember.run.once(self, function () {
                uiPhoneControl.deleteRecord();
                uiPhoneControl.save();
            });
        });

        this.get('controlChains').forEach(function (chain) {
            Ember.run.once(self, function () {
                var uiPhoneControls = [].addObjects(chain.get('uiPhoneControls'));
                chain.deleteRecord();
                chain.save().then(function(chain) {
                    uiPhoneControls.forEach(function(c) {
                        c.deleteRecord();
                        c.save();
                    });
                });
            });
        });

        var linkedModels = ['alertDialogs', 'progressDialogs', 'asyncTasks'];

        linkedModels.forEach(function (linkedModel) {
            self.get(linkedModel).forEach(function (uiPhoneControl) {
                Ember.run.once(self, function () {
                    uiPhoneControl.deleteRecord();
                    uiPhoneControl.save();
                });
            });
        });

        this._super();
    },

    toXml: function (xmlDoc) {
        var viewController;
        if(this.get('isParent')) {
            viewController = xmlDoc.createElement(this.get('xmlNameParent'));
        } else {
            viewController = xmlDoc.createElement(this.get('xmlName'));
        }
        viewController.setAttribute('id', this.get('id'));
        viewController.setAttribute('name', this.get('name'));
        viewController.setAttribute('backgroundColor', this.get('backgroundColor'));
        viewController.setAttribute('backgroundImage', this.get('backgroundImage'));

        this.get('alertDialogs').map(function (alertDialog) {
            viewController.appendChild(alertDialog.toXml(xmlDoc));
        });

        this.get('progressDialogs').map(function (progressDialog) {
            viewController.appendChild(progressDialog.toXml(xmlDoc));
        });

        this.get('asyncTasks').map(function (asyncTask) {
            viewController.appendChild(asyncTask.toXml(xmlDoc));
        });

        this.get('controlChains').filter(function(chain) {
            return chain.get('valid');
        }).map(function (controlChain) {
            viewController.appendChild(controlChain.toXml(xmlDoc));
        });

        this.get('uiPhoneControls').filter(function(control) {
            return control.get('valid');
        }).forEach(function (uiPhoneControl) {
            viewController.appendChild(uiPhoneControl.toXml(xmlDoc));
        });

        return viewController;
    },

    getRefPath: function (path) {
        if(this.get('isParent')) {
            var updatedPath = '/@' + this.get('xmlNameParent') + '[id=\'' + this.get('id') + '\']' + path;
            updatedPath = this.get('scene').getRefPath(updatedPath);
            return updatedPath;
        } else {
            return '//@' + this.get('xmlName') + '[id=\'' + this.get('id') + '\']' + path;
        }
    }

});
