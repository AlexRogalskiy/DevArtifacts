/*
 templates/control_XXX/index.hbs
 */
App.UiPhoneControlController = Ember.ObjectController.extend(App.Saveable, {
    number: 0,
    newConstraint: 'constraint',
    needs: ['viewController'],

    currentNumber: function() {
        var constraints = this.get('model.constraints');
        var n = -1;
        constraints.forEach(function(constraint) {
            var name = constraint.get('name');
            var i = parseInt(name.charAt(name.length - 1));
            if(i > n) {
                n = i;
            }
        });
        this.set('number', n + 1);
        return n + 1;
    }.property(
        'model.constraints.@each',
        'model.constraints.@each.name'
    ),

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

    isntWidthConstrained: function() {
        return !this.get('model.isWidthConstrained');
    }.property('model.isWidthConstrained'),

    isntHeightConstrained: function() {
        return !this.get('model.isHeightConstrained');
    }.property('model.isHeightConstrained'),

    isntWidthPercentConstrained: function() {
        return !this.get('model.isWidthPercentConstrained');
    }.property('model.isWidthPercentConstrained'),

    isntHeightPercentConstrained: function() {
        return !this.get('model.isHeightPercentConstrained');
    }.property('model.isHeightPercentConstrained'),

    isntRatioConstrained: function() {
        return !this.get('model.isRatioConstrained');
    }.property('model.isRatioConstrained'),

    widthCanBeConstrained: function() {
        if(this.get('model.isRatioConstrained')) {
            return false;
        } else if(this.get('model.isWidthPercentConstrained')) {
            return false;
        } else if(this.get('model').widthIsBindedByConstraints(this.get('model.constraints'))) {
            return false;
        } else if(this.get('model.controlChain')) {
            if(this.get('model.controlChain.axis') === 'horizontal' && this.get('model.controlChain.type') === 'weighted') {
                return false;
            }
        }
        return true;
    }.property(
        'model.isRatioConstrained',
        'model.isWidthPercentConstrained',
        'model.constraints.@each.layoutEdge',
        'model.constraints.@each.valid',
        'model.controlChain',
        'model.controlChain.axis',
        'model.controlChain.type'
    ),

    heightCanBeConstrained: function() {
        if(this.get('model.isRatioConstrained')) {
            return false;
        } else if(this.get('model.isHeightPercentConstrained')) {
            return false;
        } if (this.get('model').heightIsBindedByConstraints(this.get('model.constraints'))) {
            return false;
        } else if(this.get('model.controlChain')) {
            if(this.get('model.controlChain.axis') === 'vertical' && this.get('model.controlChain.type') === 'weighted') {
                return false;
            }
        }
        return true;
    }.property(
        'model.isRatioConstrained',
        'model.isHeightPercentConstrained',
        'model.constraints.@each.layoutEdge',
        'model.constraints.@each.valid',
        'model.controlChain',
        'model.controlChain.axis',
        'model.controlChain.type'
    ),

    widthPercentCanBeConstrained: function() {
        if(this.get('model.isRatioConstrained') && this.get('model.isHeightPercentConstrained')) {
            return false;
        } else if(this.get('model.isWidthConstrained')) {
            return false;
        } else if(this.get('model').widthIsBindedByConstraints(this.get('model.constraints'))) {
            return false;
        } else if(this.get('model.controlChain')) {
            if(this.get('model.controlChain.axis') === 'horizontal' && this.get('model.controlChain.type') === 'weighted') {
                return false;
            }
        }
        return true;
    }.property(
        'model.isRatioConstrained',
        'model.isHeightPercentConstrained',
        'model.isWidthConstrained',
        'model.constraints.@each.layoutEdge',
        'model.constraints.@each.valid',
        'model.controlChain',
        'model.controlChain.axis',
        'model.controlChain.type'
    ),

    heightPercentCanBeConstrained: function() {
        if(this.get('model.isRatioConstrained') && this.get('model.isWidthPercentConstrained')) {
            return false;
        } else if(this.get('model.isHeightConstrained')) {
            return false;
        } if (this.get('model').heightIsBindedByConstraints(this.get('model.constraints'))) {
            return false;
        } else if(this.get('model.controlChain')) {
            if(this.get('model.controlChain.axis') === 'vertical' && this.get('model.controlChain.type') === 'weighted') {
                return false;
            }
        }
        return true;
    }.property(
        'model.isRatioConstrained',
        'model.isWidthPercentConstrained',
        'model.isHeightConstrained',
        'model.constraints.@each.layoutEdge',
        'model.constraints.@each.valid',
        'model.controlChain',
        'model.controlChain.axis',
        'model.controlChain.type'
    ),

    ratioCanBeConstrained: function() {
        if(this.get('model.isRatioConstrained')) {
            return true;
        }
        if(!(this.get('widthCanBeConstrained')) && !(this.get('heightCanBeConstrained'))) {
            return false;
        } else if(this.get('model.isWidthConstrained') || this.get('model.isHeightConstrained')) {
            return false;
        } else if(this.get('model.isWidthPercentConstrained') && this.get('model.isHeightPercentConstrained')) {
            return false;
        }
        return true;
    }.property(
        'model.isRatioConstrained',
        'model.isWidthConstrained',
        'model.isHeightConstrained',
        'model.isWidthPercentConstrained',
        'model.isHeightPercentConstrained',
        'widthCanBeConstrained',
        'heightCanBeConstrained'
    ),

    widthCantBeConstrained: function() {
        return !this.get('widthCanBeConstrained');
    }.property('widthCanBeConstrained'),

    heightCantBeConstrained: function() {
        return !this.get('heightCanBeConstrained');
    }.property('heightCanBeConstrained'),

    widthPercentCantBeConstrained: function() {
        return !this.get('widthPercentCanBeConstrained');
    }.property('widthPercentCanBeConstrained'),

    heightPercentCantBeConstrained: function() {
        return !this.get('heightPercentCanBeConstrained');
    }.property('heightPercentCanBeConstrained'),

    ratioCantBeConstrained: function() {
        return !this.get('ratioCanBeConstrained');
    }.property('ratioCanBeConstrained'),

    actions: {
        createConstraint: function () {
            this.get('currentNumber');
            var name = this.get('newConstraint') + this.get('number');

            var constraint = this.store.createRecord('constraint', {
                uiPhoneControl: this.get('model'),
                name: name,
                layoutEdge: null,
                withParent: false,
                referenceElement: null,
                referenceLayoutEdge: null,
                valid: false
            });

            this.set('number', this.get('number') + 1);

            constraint.save().then(function (cons) {
                cons.get('uiPhoneControl.constraints').addObject(cons);
                cons.get('uiPhoneControl').save();
            });

            if(this.get('currentRouteIsViewController')) {
                this.transitionToRoute('viewController.constraint', constraint);
            } else {
                this.transitionToRoute('scene.constraint', constraint);
            }
        },

        deleteUiPhoneControl: function () {
            var self = this;
            var controlToDelete = this.get('model');
            var viewController = controlToDelete.get('viewController');

            if(viewController) {
                viewController.get('uiPhoneControls').without(controlToDelete).forEach(function(control) {
                    if(control) {
                        control.get('bindedControls').removeObject(controlToDelete);
                        control.get('constraints').forEach(function(c) {
                            if(c.get('referenceElement') === controlToDelete) {
                                control.get('constraints').removeObject(c);
                                c.deleteRecord();
                                c.save();
                            }
                        });
                        control.save();
                    }
                });
            }

            if(controlToDelete.get('controlChain')) {
                var chain = controlToDelete.get('controlChain');
                chain.get('uiPhoneControls').removeObject(controlToDelete);
                chain.save().then(function(c) {
                    var viewController = self.get('viewController');
                    var uiPhoneControls = viewController.get('uiPhoneControls');
                    uiPhoneControls.removeObject(controlToDelete);
                    viewController.save().then(function(vc) {
                        controlToDelete.deleteRecord();
                        controlToDelete.save();
                    });
                });
            } else {
                var uiPhoneControls = viewController.get('uiPhoneControls');
                uiPhoneControls.removeObject(controlToDelete);
                viewController.save().then(function(vc) {
                    controlToDelete.deleteRecord();
                    controlToDelete.save();
                });
            }

            if(this.get('currentRouteIsViewController')) {
                this.transitionToRoute('viewController');
            } else {
                this.transitionToRoute('vc');
            }
        }
    }

});
