App.UiPhoneControl = App.UiControl.extend({
    // Defined here to be able to use them, but the values are overwritten in child classes
    defaultWidth: 0,
    defaultHeight: 0,
    widthFixed: DS.attr('number', {defaultValue: 1}),
    heightFixed: DS.attr('number', {defaultValue: 1}),

    //Override
    /*--------------------------------------------------------------*/
    //posY: DS.attr('number', {defaultValue: 96}),
    /*--------------------------------------------------------------*/

    viewController: DS.belongsTo('viewController', {inverse: 'uiPhoneControls'}),
    controlChain: DS.belongsTo('controlChain', {inverse: 'uiPhoneControls'}),
    weightInChain: DS.attr('number', {defaultValue: 1}),

    constraints: DS.hasMany('constraint', {inverse: 'uiPhoneControl'}),
    bindedControls: DS.hasMany('uiPhoneControl', {polymorphic: true}),
    isWidthConstrained: DS.attr('boolean', {defaultValue: false}),
    isHeightConstrained: DS.attr('boolean', {defaultValue: false}),
    isWidthPercentConstrained: DS.attr('boolean', {defaultValue: false}),
    isHeightPercentConstrained: DS.attr('boolean', {defaultValue: false}),
    widthPercent: DS.attr('number', {defaultValue: 1}),
    heightPercent: DS.attr('number', {defaultValue: 1}),
    isRatioConstrained: DS.attr('boolean', {defaultValue: false}),
    ratioWidth: DS.attr('number', {defaultValue: 1}),
    ratioHeight: DS.attr('number', {defaultValue: 1}),

    valid: function() {
        if(this.get('controlChain')) {
            if(this.get('controlChain.valid')) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }.property('controlChain', 'controlChain.valid'),

    validConstraints: function() {
        return this.get('constraints').filter(function(c) {
    		return c.get('valid');
    	});
    }.property('constraints.@each.valid'),

    widthIsBindedByConstraints: function(constraints) {
        var xConstraintsNumber = 0;
        constraints.forEach(function(constraint) {
            if(constraint.get('valid')) {
                if(constraint.get('layoutEdge') === 'start' || constraint.get('layoutEdge') === 'end') {
                    xConstraintsNumber++;
                }
            }
        });
        if(xConstraintsNumber > 1) {
            return true;
        } else {
            return false;
        }
    },

    heightIsBindedByConstraints: function(constraints) {
        var yConstraintsNumber = 0;
        constraints.forEach(function(constraint) {
            if(constraint.get('valid')) {
                if(constraint.get('layoutEdge') === 'top' || constraint.get('layoutEdge') === 'bottom') {
                    yConstraintsNumber++;
                }
            }
        });
        if(yConstraintsNumber > 1) {
            return true;
        } else {
            return false;
        }
    },

    siblings: function () {
        if (this.get('viewController.uiPhoneControls')) {
            return this.get('viewController.uiPhoneControls').without(this);
        }
        return null;
    }.property('viewController.uiPhoneControls.@each'),

    getTopWithMargin: function(onlyValid, vcTop, vcCenterY) {
        // Get constraints
        var constraints;
        if(onlyValid) {
            constraints = this.get('validConstraints');
        } else {
            constraints = this.get('constraints').filter(function(c) {
                return (c.get('layoutEdge') === 'top') || (c.get('layoutEdge') === 'bottom');
            });
        }
        // Process constraints
        var i, layoutEdge = 'empty', referencePosition;
        for(i = 0; i < constraints.get('length') && layoutEdge !== 'top'; i++) {
            var c = constraints.objectAt(i);
            if(c.get('layoutEdge') === 'top') {
                layoutEdge = 'top';
                if(c.get('referenceLayoutEdge') === 'top') {
                    if(c.get('withParent')) {
                        referencePosition = vcTop;
                    } else {
                        referencePosition = c.get('referenceElement.top');
                    }
                } else {
                    // Top aligned with Bottom can't be with parent
                    referencePosition = c.get('referenceElement.bottomWithMargin');
                }
            } else if(c.get('layoutEdge') === 'bottom') {
                layoutEdge = 'bottom';
            } else if(c.get('layoutEdge') === 'centerY') {
                layoutEdge = 'centerY';
                if(c.get('withParent')) {
                    referencePosition = vcCenterY - (this.get('height') / 2);
                } else {
                    referencePosition = c.get('referenceElement.centerY') - (this.get('height') / 2);
                }
            }
        }
        // In the case of bottom, i set here referencePosition to escape from infinte recursion
        if(layoutEdge === 'bottom') {
            referencePosition = this.get('bottomWithMargin') - this.get('outerHeight');
        }
        // Return position
        if(layoutEdge !== 'empty') {
            return referencePosition;
        } else {
            return parseFloat(this.get('posY')) + vcTop;
        }
    },

    topWithMargin: function () {
        if(!this.get('isDeleted')) {
            if(this.get('controlChain') && this.get('controlChain.axis') === 'vertical') {
                return this.get('controlChain').getTopInChain(this.get('id'), this.get('viewController.top'));
            } else {
                return this.getTopWithMargin(true, this.get('viewController.top'), this.get('viewController.centerY'));
            }
        } else {
            return null;
        }
    }.property(
        'controlChain',
        'controlChain.axis',
        'controlChain.type',
        'controlChain.totalValue',
        'controlChain.bias',
        'controlChain.spacing',
        'controlChain.availableSpace',
        'controlChain.valid',
        'bindedControls.@each.top',
        'posY',
        'outerHeight',
        'height',
        'constraints.@each.layoutEdge',
        'constraints.@each.withParent',
        'constraints.@each.referenceElement',
        'constraints.@each.referenceElement.marginTop',
        'constraints.@each.referenceElement.marginBottom',
        'constraints.@each.referenceLayoutEdge',
        'constraints.@each.valid',
        'viewController.top',
        'viewController.centerY',
        'bottomWithMargin'
    ),

    top: function () {
        return this.get('topWithMargin') + parseFloat(this.get('marginTop'));
    }.property('topWithMargin'),

    getBottomWithMargin: function(onlyValid, vcBottom) {
        // Get constraints
        var constraints;
        if(onlyValid) {
            constraints = this.get('validConstraints');
        } else {
            constraints = this.get('constraints').filter(function(c) {
                return (c.get('layoutEdge') === 'top') || (c.get('layoutEdge') === 'bottom');
            });
        }
        // Process constraints
        var i, layoutEdge = 'empty', referencePosition;
        for(i = 0; i < constraints.get('length') && layoutEdge !== 'bottom'; i++) {
            var c = constraints.objectAt(i);
            if(c.get('layoutEdge') === 'bottom') {
                layoutEdge = 'bottom';
                if(c.get('referenceLayoutEdge') === 'bottom') {
                    if(c.get('withParent')) {
                        referencePosition = vcBottom;
                    } else {
                        referencePosition = c.get('referenceElement.bottom');
                    }
                } else {
                    // Bottom aligned with top can't be with parent
                    referencePosition = c.get('referenceElement.topWithMargin');
                }
            } else if(c.get('layoutEdge') === 'top') {
                layoutEdge = 'top';
            } else if(c.get('layoutEdge') === 'centerY') {
                layoutEdge = 'centerY';
                referencePosition = this.get('topWithMargin') + this.get('outerHeight');
            }
        }
        // In the case of top, i set here referencePosition to escape from infinte recursion
        if(layoutEdge === 'top') {
            referencePosition = this.get('topWithMargin') + this.get('outerHeight');
        }
        // Return position
        if(layoutEdge !== 'empty') {
            return referencePosition;
        } else {
            return this.get('topWithMargin') + this.get('outerHeight');
        }
    },

    bottomWithMargin: function () {
        if(!this.get('isDeleted')) {
            if(this.get('controlChain') && this.get('controlChain.axis') === 'vertical') {
                return this.get('controlChain').getBottomInChain(this.get('id'), this.get('weightInChain'), false);
            } else {
                return this.getBottomWithMargin(true, this.get('viewController.bottom'));
            }
        } else {
            return null;
        }
    }.property(
        'controlChain',
        'controlChain.axis',
        'controlChain.type',
        'controlChain.totalValue',
        'controlChain.bias',
        'controlChain.spacing',
        'controlChain.availableSpace',
        'controlChain.valid',
        'bindedControls.@each.bottom',
        'constraints.@each.layoutEdge',
        'constraints.@each.withParent',
        'constraints.@each.referenceElement',
        'constraints.@each.referenceElement.marginTop',
        'constraints.@each.referenceElement.marginBottom',
        'constraints.@each.referenceLayoutEdge',
        'constraints.@each.valid',
        'topWithMargin',
        'outerHeight',
        'viewController.bottom'
    ),

    bottom: function () {
        return this.get('bottomWithMargin') - parseFloat(this.get('marginBottom'));
    }.property('bottomWithMargin'),

    getStartWithMargin: function(onlyValid, vcStart, vcCenterX) {
        // Get constraints
        var constraints;
        if(onlyValid) {
            constraints = this.get('validConstraints');
        } else {
            constraints = this.get('constraints').filter(function(c) {
                return (c.get('layoutEdge') === 'start') || (c.get('layoutEdge') === 'end');
            });
        }
        // Process constraints
        var i, layoutEdge = 'empty', referencePosition;
        for(i = 0; i < constraints.get('length') && layoutEdge !== 'start'; i++) {
            var c = constraints.objectAt(i);
            if(c.get('layoutEdge') === 'start') {
                layoutEdge = 'start';
                if(c.get('referenceLayoutEdge') === 'start') {
                    if(c.get('withParent')) {
                        referencePosition = vcStart;
                    } else {
                        referencePosition = c.get('referenceElement.start');
                    }
                } else {
                    // Start aligned with end can't be with parent
                    referencePosition = c.get('referenceElement.endWithMargin');
                }
            } else if(c.get('layoutEdge') === 'end') {
                layoutEdge = 'end';
            } else if(c.get('layoutEdge') === 'centerX') {
                layoutEdge = 'centerX';
                if(c.get('withParent')) {
                    referencePosition = vcCenterX - (this.get('width') / 2);
                } else {
                    referencePosition = c.get('referenceElement.centerX') - (this.get('width') / 2);
                }
            }
        }
        // In the case of end, i set here referencePosition to escape from infinte recursion
        if(layoutEdge === 'end') {
            referencePosition = this.get('endWithMargin') - this.get('outerWidth');
        }
        // Return position
        if(layoutEdge !== 'empty') {
            return referencePosition;
        } else {
            return parseFloat(this.get('posX')) + vcStart;
        }
    },

    startWithMargin: function () {
        if(!this.get('isDeleted')) {
            if(this.get('controlChain') && this.get('controlChain.axis') === 'horizontal') {
                return this.get('controlChain').getStartInChain(this.get('id'), this.get('viewController.start'));
            } else {
                return this.getStartWithMargin(true, this.get('viewController.start'), this.get('viewController.centerX'));
            }
        } else {
            return null;
        }
    }.property(
        'controlChain',
        'controlChain.axis',
        'controlChain.type',
        'controlChain.totalValue',
        'controlChain.bias',
        'controlChain.availableSpace',
        'controlChain.spacing',
        'controlChain.valid',
        'bindedControls.@each.start',
        'constraints.@each.layoutEdge',
        'constraints.@each.withParent',
        'constraints.@each.referenceElement',
        'constraints.@each.referenceElement.marginStart',
        'constraints.@each.referenceElement.marginEnd',
        'constraints.@each.referenceLayoutEdge',
        'constraints.@each.valid',
        'posX',
        'outerWidth',
        'width',
        'endWithMargin',
        'viewController.start',
        'viewController.centerX'
    ),

    start: function () {
        return this.get('startWithMargin') + parseFloat(this.get('marginStart'));
    }.property('startWithMargin'),

    getEndWithMargin: function(onlyValid, vcEnd) {
        // Get constraints
        var constraints;
        if(onlyValid) {
            constraints = this.get('validConstraints');
        } else {
            constraints = this.get('constraints').filter(function(c) {
                return (c.get('layoutEdge') === 'start') || (c.get('layoutEdge') === 'end');
            });
        }
        // Process constraints
        var i, layoutEdge = 'empty', referencePosition;
        for(i = 0; i < constraints.get('length') && layoutEdge !== 'end'; i++) {
            var c = constraints.objectAt(i);
            if(c.get('layoutEdge') === 'end') {
                layoutEdge = 'end';
                if(c.get('referenceLayoutEdge') === 'end') {
                    if(c.get('withParent')) {
                        referencePosition = vcEnd;
                    } else {
                        referencePosition = c.get('referenceElement.end');
                    }
                } else {
                    // End aligned with start can't be with parent
                    referencePosition = c.get('referenceElement.startWithMargin');
                }
            } else if(c.get('layoutEdge') === 'start') {
                layoutEdge = 'start';
            } else if(c.get('layoutEdge') === 'centerX') {
                layoutEdge = 'centerX';
                referencePosition = this.get('startWithMargin') + this.get('outerWidth');
            }
        }
        // In the case of start, i set here referencePosition to escape from infinte recursion
        if(layoutEdge === 'start') {
            referencePosition = this.get('startWithMargin') + this.get('outerWidth');
        }
        // Return position
        if(layoutEdge !== 'empty') {
            return referencePosition;
        } else {
            return this.get('startWithMargin') + this.get('outerWidth');
        }
    },

    endWithMargin: function () {
        if(!this.get('isDeleted')) {
            if(this.get('controlChain') && this.get('controlChain.axis') === 'horizontal') {
                return this.get('controlChain').getEndInChain(this.get('id'), this.get('weightInChain'), false);
            } else {
                return this.getEndWithMargin(true, this.get('viewController.end'));
            }
        } else {
            return null;
        }
    }.property(
        'controlChain',
        'controlChain.axis',
        'controlChain.type',
        'controlChain.totalValue',
        'controlChain.bias',
        'controlChain.spacing',
        'controlChain.valid',
        'controlChain.availableSpace',
        'bindedControls.@each.end',
        'constraints.@each.layoutEdge',
        'constraints.@each.withParent',
        'constraints.@each.referenceElement',
        'constraints.@each.referenceElement.marginStart',
        'constraints.@each.referenceElement.marginEnd',
        'constraints.@each.referenceLayoutEdge',
        'constraints.@each.valid',
        'startWithMargin',
        'outerWidth',
        'viewController.end'
    ),

    end: function () {
        return this.get('endWithMargin') - parseFloat(this.get('marginEnd'));
    }.property('endWithMargin'),

    centerX: function() {
        return this.get('start') + (this.get('width') / 2);
    }.property('start', 'width'),

    centerY: function() {
        return this.get('top') + (this.get('height') / 2);
    }.property('top', 'height'),

    computedWidth: function () {
        return parseFloat(this.get('end')) -
            parseFloat(this.get('start'));
    }.property(
        'start',
        'end',
        'marginStart',
        'paddingStart',
        'paddingEnd',
        'marginEnd'),

    computedHeight: function () {
        return parseFloat(this.get('bottom')) -
            parseFloat(this.get('top'));
    }.property(
        'top',
        'bottom',
        'marginTop',
        'paddingTop',
        'paddingBottom',
        'marginBottom'),

    outerWidth: function () {
        return parseFloat(this.get('marginStart')) +
            parseFloat(this.get('width')) +
            parseFloat(this.get('marginEnd'));
    }.property(
        'marginStart',
        'paddingStart',
        'width',
        'paddingEnd',
        'marginEnd'),

    outerHeight: function () {
        return parseFloat(this.get('marginTop')) +
            parseFloat(this.get('height')) +
            parseFloat(this.get('marginBottom'));
    }.property(
        'marginTop',
        'paddingTop',
        'height',
        'paddingBottom',
        'marginBottom'),

    width: function() {
        /*  Check viewController because when controller delete a control, first it remove
            the viewController and then it delete the control. Without check an error occur */
        if(this.get('viewController')) {
            if(this.get('isWidthConstrained')) {
                return parseFloat(this.get('widthFixed'));
            } else if(this.get('isWidthPercentConstrained')) {
                return this.get('viewController').getWidthFromPercent(this.get('widthPercent'));
            } else if(this.widthIsBindedByConstraints(this.get('constraints'))) {
                return this.get('computedWidth');
            } else if(this.get('controlChain') && (this.get('controlChain.axis') === 'horizontal') && (this.get('controlChain.type') === 'weighted')) {
                return this.get('computedWidth');
            } else if(this.get('isRatioConstrained')) {
                if(this.get('isHeightPercentConstrained') || this.heightIsBindedByConstraints(this.get('constraints'))) {
                    return this.get('height') * (this.get('ratioWidth') / this.get('ratioHeight'));
                }
                return this.get('defaultWidth');
            }
            return this.get('defaultWidth');
        }
        return null;
    }.property(
        'viewController',
        'isWidthConstrained',
        'widthFixed',
        'isWidthPercentConstrained',
        'widthPercent',
        'viewController.width',
        'computedWidth',
        'controlChain',
        'controlChain.axis',
        'controlChain.type',
        'isRatioConstrained',
        'isHeightPercentConstrained',
        'height',
        'ratioWidth',
        'ratioHeight',
        'defaultWidth'
    ),

    height: function() {
        /*  Check viewController because when controller delete a control, first it remove
            the viewController and then it delete the control. Without check an error occur */
        if(this.get('viewController')) {
            if(this.get('isHeightConstrained')) {
                return parseFloat(this.get('heightFixed'));
            } else if(this.get('isHeightPercentConstrained')) {
                return this.get('viewController').getHeightFromPercent(this.get('heightPercent'));
            } else if(this.heightIsBindedByConstraints(this.get('constraints'))) {
                return this.get('computedHeight');
            } else if(this.get('controlChain') && (this.get('controlChain.axis') === 'vertical') && (this.get('controlChain.type') === 'weighted')) {
                return this.get('computedHeight');
            } else if(this.get('isRatioConstrained')) {
                return this.get('width') * (this.get('ratioHeight') / this.get('ratioWidth'));
            }
            return this.get('defaultHeight');
        }
        return null;
    }.property(
        'viewController',
        'isHeightConstrained',
        'heightFixed',
        'isHeightPercentConstrained',
        'heightPercent',
        'viewController.height',
        'computedHeight',
        'controlChain',
        'controlChain.axis',
        'controlChain.type',
        'isRatioConstrained',
        'ratioHeight',
        'ratioWidth',
        'width',
        'defaultHeight'
    ),

    weightInChainCanBeChanged: function() {
        if(!this.get('isDeleted') && this.get('controlChain')) {
            if(this.get('controlChain.type') === 'weighted') {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }.property('controlChain.type'),

    weightInChainCantBeChanged: function() {
        return !this.get('weightInChainCanBeChanged');
    }.property('weightInChainCanBeChanged'),

    marginTopCantBeChanged: function() {
        if(!this.get('isDeleted')) {
            if(this.get('controlChain') && this.get('controlChain.axis') === 'vertical') {
                return !this.get('controlChain').canMarginTopBeChanged(this.get('id'));
            } else {
                return false;
            }
        }
        return true;
    }.property(
        'controlChain',
        'controlChain.type',
        'controlChain.axis'
    ),

    marginBottomCantBeChanged: function() {
        if(!this.get('isDeleted')) {
            if(this.get('controlChain') && this.get('controlChain.axis') === 'vertical') {
                return !this.get('controlChain').canMarginBottomBeChanged(this.get('id'));
            } else {
                return false;
            }
        }
        return true;
    }.property(
        'controlChain',
        'controlChain.type',
        'controlChain.axis',
        'controlChain.uiPhoneControls.length'
    ),

    marginStartCantBeChanged: function() {
        if(!this.get('isDeleted')) {
            if(this.get('controlChain') && this.get('controlChain.axis') === 'horizontal') {
                return !this.get('controlChain').canMarginStartBeChanged(this.get('id'));
            } else {
                return false;
            }
        }
        return true;
    }.property(
        'controlChain',
        'controlChain.type',
        'controlChain.axis'
    ),

    marginEndCantBeChanged: function() {
        if(!this.get('isDeleted')) {
            if(this.get('controlChain') && this.get('controlChain.axis') === 'horizontal') {
                return !this.get('controlChain').canMarginEndBeChanged(this.get('id'));
            } else {
                return false;
            }
        }
        return true;
    }.property(
        'controlChain',
        'controlChain.type',
        'controlChain.axis',
        'controlChain.uiPhoneControls.length'
    ),

    marginObserver: function() {
        if(!this.get('isDeleted')) {
            if(this.get('marginTopCantBeChanged')) {
                this.set('marginTop', 0);
            }
            if(this.get('marginBottomCantBeChanged')) {
                this.set('marginBottom', 0);
            }
            if(this.get('marginStartCantBeChanged')) {
                this.set('marginStart', 0);
            }
            if(this.get('marginEndCantBeChanged')) {
                this.set('marginEnd', 0);
            }
            this.save();
        }
    }.observes(
        'marginTopCantBeChanged',
        'marginBottomCantBeChanged',
        'marginStartCantBeChanged',
        'marginEndCantBeChanged'
    ),

    valueObserver: function() {
        if(!this.get('isDeleted')) {
            this.set('weightInChain', parseInt(this.get('weightInChain')));
        }
    }.observes('weightInChain'),

    // Used to reload views
    didCreate: function () {
        this.set('name', 'id' + this.get('id') + this.constructor.toString().split(".")[1]);
    },

    updateNavigations: function(isVC, removedItemId) {
        if(this.get('navigations')) {
            this.get('navigations').forEach(function(nav) {
                if(isVC && (nav.get('destinationViewController.id') === removedItemId)) {
                    nav.set('destinationViewController', null);
                    nav.save();
                } else if(!isVC && (nav.get('destinationScene.id') === removedItemId)) {
                    nav.set('destinationScene', null);
                    nav.save();
                } else if(!isVC && (nav.get('contextId') === removedItemId)) {
                    this.get('navigations').removeObject(nav);
                    this.save().then(function(upc) {
                        nav.deleteRecord();
                        nav.save();
                    });
                }
            });
        }
    },

    deleteRecord: function () {
        var self = this;

        var myConstraints = this.get('constraints');
        myConstraints.forEach(function (constraint) {
            Ember.run.once(self, function () {
                constraint.deleteRecord();
                constraint.save();
            });
        });

        this._super();
    },

    decorateXml: function (xmlDoc, xmlElem) {
        xmlElem.setAttribute('id', this.get('name'));

        if(this.get('viewController')) {
            xmlElem.setAttribute('viewController', this.get('viewController').getRefPath(''));
        }

        xmlElem.setAttribute('defaultWidth', this.get('defaultWidth'));
        xmlElem.setAttribute('defaultHeight', this.get('defaultHeight'));

        // Export width and height of the reference device for iOS (now it's the iPhone7 Plus)
        /*var width, height, start, top;
        if(!this.get('controlChain')) {
            width = this.getEndWithMargin(true, 414) - parseFloat(this.get('marginEnd'))
            - (this.getStartWithMargin(true, 0, 207) + parseFloat(this.get('marginStart')));
            height = this.getBottomWithMargin(true, 736) - parseFloat(this.get('marginBottom'))
            - (this.getTopWithMargin(true, 64, 400) + parseFloat(this.get('marginTop')));
            top = this.getTopWithMargin(true, 64, 400) + parseFloat(this.get('marginTop'));
            start = this.getStartWithMargin(true, 0, 207) + parseFloat(this.get('marginStart'));
        } else {
            width = this.get('controlChain').getEndInChain(this.get('id'), this.get('weightInChain'), true) - parseFloat(this.get('marginEnd'))
            - (this.get('controlChain').getStartInChain(this.get('id'), 0) + parseFloat(this.get('marginStart')));
            height = this.get('controlChain').getBottomInChain(this.get('id'), this.get('weightInChain'), true) - parseFloat(this.get('marginBottom'))
            - (this.get('controlChain').getTopInChain(this.get('id'), 64) + parseFloat(this.get('marginTop')));
            top = this.get('controlChain').getTopInChain(this.get('id'), 64) + parseFloat(this.get('marginTop'));
            start = this.get('controlChain').getStartInChain(this.get('id'), 0) + parseFloat(this.get('marginStart'));
        }
        xmlElem.setAttribute('width', width);
        xmlElem.setAttribute('height', height);*/
        xmlElem.setAttribute('posX', this.get('posX'));
        xmlElem.setAttribute('posY', this.get('posY'));

        if(this.get('controlChain')) {
            var controlChain = this.get('controlChain');
            xmlElem.setAttribute('controlChain', controlChain.getRefPath(''));
            xmlElem.setAttribute('indexInChain', controlChain.getIndex(this));
            if(controlChain.getPrecedentControl(this)) {
                xmlElem.setAttribute('precedentInChain', controlChain.getPrecedentControl(this).getRefPath(''));
            }
            if(controlChain.getFollowingControl(this)) {
                xmlElem.setAttribute('followingInChain', controlChain.getFollowingControl(this).getRefPath(''));
            }
            if(controlChain.get('type') === 'weighted') {
                xmlElem.setAttribute('weight', this.get('weightInChain'));
            }
        }

        xmlElem.setAttribute('paddingTop', this.get('paddingTop'));
        xmlElem.setAttribute('paddingBottom', this.get('paddingBottom'));
        xmlElem.setAttribute('paddingStart', this.get('paddingStart'));
        xmlElem.setAttribute('paddingEnd', this.get('paddingEnd'));

        xmlElem.setAttribute('marginTop', this.get('marginTop'));
        xmlElem.setAttribute('marginBottom', this.get('marginBottom'));
        xmlElem.setAttribute('marginStart', this.get('marginStart'));
        xmlElem.setAttribute('marginEnd', this.get('marginEnd'));

        var constraints = this.get('constraints').filter(function(c) {
            return c.get('valid');
        });
        if(constraints.get('length') > 0 || this.get('isWidthConstrained') || this.get('isHeightConstrained')  || this.get('isWidthPercentConstrained')  || this.get('isHeightPercentConstrained') || this.get('isRatioConstrained')) {
            var dimensionConstraints = xmlDoc.createElement('dimensionConstraint');
            var mustExportDimensionConstraints = false;

            dimensionConstraints.setAttribute('uiPhoneControl', this.getRefPath(''));

            if(this.get('isWidthConstrained')) {
                dimensionConstraints.setAttribute('fixedWidth', this.get('widthFixed'));
                mustExportDimensionConstraints = true;
            }
            if(this.get('isHeightConstrained')) {
                dimensionConstraints.setAttribute('fixedHeight', this.get('heightFixed'));
                mustExportDimensionConstraints = true;
            }
            if(this.get('isRatioConstrained')) {
                dimensionConstraints.setAttribute('fixedRatio', this.get('ratioWidth') + ':' + this.get('ratioHeight'));
                mustExportDimensionConstraints = true;
            }
            if(this.get('isWidthPercentConstrained')) {
                dimensionConstraints.setAttribute('widthPercent', this.get('widthPercent'));
                mustExportDimensionConstraints = true;
            }
            if(this.get('isHeightPercentConstrained')) {
                dimensionConstraints.setAttribute('heightPercent', this.get('heightPercent'));
                mustExportDimensionConstraints = true;
            }
            if(mustExportDimensionConstraints) {
                xmlElem.appendChild(dimensionConstraints);
            }

            constraints.forEach(function(constraint) {
                xmlElem.appendChild(constraint.toXml(xmlDoc));
            });
        }

        return xmlElem;
    },

    getRefPath: function (path) {
        var updatedPath = '/@' + this.get('xmlName') + '[id=\'' + this.get('name') + '\']' + path;
        updatedPath = this.get('viewController').getRefPath(updatedPath);
        return updatedPath;
    }

});
