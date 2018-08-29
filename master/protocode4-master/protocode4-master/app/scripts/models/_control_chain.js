App.ControlChain = DS.Model.extend({
    viewController: DS.belongsTo('viewController', {inverse: 'controlChains'}),

    name: DS.attr('string'),
    axis: DS.attr('string'),
    type: DS.attr('string'),
    bias: DS.attr('number', {defaultValue: 0.5}),
    uiPhoneControls: DS.hasMany('uiPhoneControl', {polymorphic: true}),
    spacing: DS.attr('number', {defaultValue: 0}),

    xmlName: 'controlChains',
    xmlNameChild: 'controlsInChain',

    valid: function() {
        if(!this.get('isDeleted')) {
            if(this.get('axis') && this.get('type') && this.get('uiPhoneControls.length') >= 2) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }.property('axis', 'type', 'uiPhoneControls.@each'),

    totalValue: function() {
        var total = 0;
        this.get('uiPhoneControls').forEach(function(c) {
            total = total + c.get('weightInChain');
        });
        return total;
    }.property(
        'uiPhoneControls.@each.weightInChain'
    ),

    biasCantBeChanged: function() {
        if(!this.get('isDeleted')) {
            if(this.get('type')) {
                return this.get('type') !== 'packed';
            }
        }
        return true;
    }.property('type'),

    getAvailableSpace: function(vcWidth, vcHeight) {
        var controls = this.get('uiPhoneControls');
        var dimension;
        var availableSpace;
        if(!this.get('valid')) {
            return 0;
        }
        if(this.get('axis') === 'horizontal') {
            dimension = 'width';
            availableSpace = vcWidth;
        } else {
            dimension = 'height';
            availableSpace = vcHeight;
        }
        var firstMargin, lastMargin;
        if(dimension === 'height') {
            firstMargin = parseFloat(controls.get('firstObject.marginTop'));
            lastMargin = parseFloat(controls.get('lastObject.marginBottom'));
        } else {
            firstMargin = parseFloat(controls.get('firstObject.marginStart'));
            lastMargin = parseFloat(controls.get('lastObject.marginEnd'));
        }
        availableSpace = availableSpace - firstMargin - lastMargin;
        // WEIGHTED case: availableSpace is the space available for controls
        // ALL other cases: availableSpace is the space available to distribute the controls (empty space)
        if(this.get('type') === 'weighted') {
            return availableSpace - ((controls.get('length') + 1) * this.get('spacing'));
        } else if(this.get('type') === 'packed') {
            var spaceForControls = 0;
            controls.forEach(function(c) {
                spaceForControls = spaceForControls + parseFloat(c.get(dimension));
            });
            return availableSpace - ((controls.get('length') - 1) * this.get('spacing')) - spaceForControls;
        } else {
            var spaceForControls = 0;
            controls.forEach(function(c) {
                spaceForControls = spaceForControls + parseFloat(c.get(dimension));
            });
            return availableSpace - spaceForControls;
        }
    },

    availableSpace: function() {
        return this.getAvailableSpace(this.get('viewController.width'), this.get('viewController.height'));
    }.property(
        'valid',
        'type',
        'axis',
        'viewController.height',
        'spacing',
        'viewController.width',
        'uiPhoneControls.length',
        'uiPhoneControls.@each.width',
        'uiPhoneControls.@each.height',
        'uiPhoneControls.@each.marginTop',
        'uiPhoneControls.@each.marginBottom',
        'uiPhoneControls.@each.marginStart',
        'uiPhoneControls.@each.marginEnd'
    ),

    spacingCantBeChanged: function() {
        if(!this.get('isDeleted')) {
            return (this.get('type') === 'spread') || (this.get('type') === 'spread_inside');
        }
        return true;
    }.property('type'),

    spacingSet: function() {
        if(!(this.get('isDeleted'))) {
            this.set('spacing', parseFloat(this.get('spacing')));
        }
    }.observes('spacing'),

    biasSet: function() {
        if(!(this.get('isDeleted'))) {
            this.set('bias', parseFloat(this.get('bias')));
        }
    }.observes('bias'),

    getSpreadSpace: function(inside, forXml) {
        var controls = this.get('uiPhoneControls');
        var spreadSpace, slots;
        if(inside)  {
            if(controls.get('length') > 1) {
                slots = controls.get('length') - 1;
            } else {
                slots = 1;
            }
        } else {
            slots = controls.get('length') + 1;
        }
        if(forXml) {
            spreadSpace = this.getAvailableSpace(this.get('viewController.width'), this.get('viewController.height')) / slots;
        } else {
            spreadSpace = this.get('availableSpace') / slots;
        }

        return spreadSpace;
    },

    getPackedSpace: function(first, forXml) {
        var packedSpace;
        var availableSpace;
        if(forXml) {
            availableSpace = this.getAvailableSpace(this.get('viewController.width'), this.get('viewController.height'));
        } else {
            availableSpace = this.get('availableSpace');
        }
        if(first) {
            packedSpace = availableSpace * this.get('bias');
        } else {
            packedSpace = availableSpace * (1 - this.get('bias'));
        }
        return packedSpace;
    },

    getTopInChain: function(controlId, vcTop) {
        if(this.get('valid')) {
            var controls = this.get('uiPhoneControls');
            var control = controls.findBy('id', controlId);
            var index = controls.indexOf(control);
            if(this.get('axis') === 'vertical') {
                // Case type: weighted
                if(this.get('type') === 'weighted') {
                    var topInChain;
                    if(index === 0) {
                        topInChain = vcTop;
                    } else {
                        var precedingControl = controls.objectAt(index - 1);
                        topInChain = parseFloat(precedingControl.get('bottom'));
                    }
                    topInChain = topInChain + this.get('spacing');
                    return topInChain;
                } else if(this.get('type') === 'spread') {
                    // Case type: spread
                    var spreadSpace = this.getSpreadSpace(false, false);
                    var topInChain;
                    if(index === 0) {
                        topInChain = vcTop + spreadSpace;
                    } else {
                        var precedingControl = controls.objectAt(index - 1);
                        topInChain = parseFloat(precedingControl.get('bottom')) + spreadSpace;
                    }
                    return topInChain;
                } else if(this.get('type') === 'spread_inside') {
                    // Case type: spread_inside
                    var spreadSpace = this.getSpreadSpace(true, false);
                    var topInChain;
                    if(index === 0) {
                        topInChain = vcTop;
                    } else {
                        var precedingControl = controls.objectAt(index - 1);
                        topInChain = parseFloat(precedingControl.get('bottom')) + spreadSpace;
                    }
                    return topInChain;
                } else if(this.get('type') === 'packed') {
                    // Case type: packed
                    var packedSpaceFirst = this.getPackedSpace(true, false);
                    var topInChain;
                    if(index === 0) {
                        topInChain = vcTop + packedSpaceFirst;
                    } else {
                        var precedingControl = controls.objectAt(index - 1);
                        topInChain = parseFloat(precedingControl.get('bottom')) + this.get('spacing');
                    }
                    return topInChain;
                }
            } else {
                if(index === 0) {
                    return control.getTopWithMargin(true);
                } else {
                    return controls.get('firstObject.topWithMargin');
                }
            }
        } else {
            return 0;
        }
    },

    getBottomInChain: function(controlId, value, forXml) {
        if(this.get('valid')) {
            var controls = this.get('uiPhoneControls');
            var control = controls.findBy('id', controlId);
            if(this.get('axis') === 'vertical') {
                // Case type: weighted
                if(this.get('type') === 'weighted') {
                    var availableSpace;
                    if(forXml) {
                        availableSpace = this.getAvailableSpace(this.get('viewController.width'), this.get('viewController.height'));
                    } else {
                        availableSpace = this.get('availableSpace');
                    }
                    var height = availableSpace / this.get('totalValue') * value;
                    var bottomInChain = parseFloat(control.get('top')) + height + parseFloat(control.get('marginBottom'));
                    return bottomInChain;
                } else if(this.get('type') === 'spread') {
                    // Case type: spread
                    return (parseFloat(control.get('topWithMargin')) + parseFloat(control.get('outerHeight')));
                } else if(this.get('type') === 'spread_inside') {
                    // Case type: spread_inside
                    return (parseFloat(control.get('topWithMargin')) + parseFloat(control.get('outerHeight')));
                } else if(this.get('type') === 'packed') {
                    // Case type: packed
                    return (parseFloat(control.get('topWithMargin')) + parseFloat(control.get('outerHeight')));
                }
            } else {
                return parseFloat(control.getBottomWithMargin(true));
            }
        } else {
            return 0;
        }
    },

    getStartInChain: function(controlId, vcStart) {
        if(this.get('valid')) {
            var controls = this.get('uiPhoneControls');
            var control = controls.findBy('id', controlId);
            var index = controls.indexOf(control);
            if(this.get('axis') === 'horizontal') {
                // Case type: weighted
                if(this.get('type') === 'weighted') {
                    var startInChain;
                    if(index === 0) {
                        startInChain = vcStart;
                    } else {
                        var precedingControl = controls.objectAt(index - 1);
                        startInChain = parseFloat(precedingControl.get('end'));
                    }
                    startInChain = startInChain + this.get('spacing');
                    return startInChain;
                } else if(this.get('type') === 'spread') {
                    // Case type: spread
                    var spreadSpace = this.getSpreadSpace(false, false);
                    var startInChain;
                    if(index === 0) {
                        startInChain = vcStart + spreadSpace;
                    } else {
                        var precedingControl = controls.objectAt(index - 1);
                        startInChain = parseFloat(precedingControl.get('end')) + spreadSpace;
                    }
                    return startInChain;
                } else if(this.get('type') === 'spread_inside') {
                    // Case type: spread_inside
                    var spreadSpace = this.getSpreadSpace(true, false);
                    var startInChain;
                    if(index === 0) {
                        startInChain = vcStart;
                    } else {
                        var precedingControl = controls.objectAt(index - 1);
                        startInChain = parseFloat(precedingControl.get('end')) + spreadSpace;
                    }
                    return startInChain;
                } else if(this.get('type') === 'packed') {
                    // Case type: packed
                    var packedSpaceFirst = this.getPackedSpace(true, false);
                    var startInChain;
                    if(index === 0) {
                        startInChain = vcStart + packedSpaceFirst;
                    } else {
                        var precedingControl = controls.objectAt(index - 1);
                        startInChain = parseFloat(precedingControl.get('end')) + this.get('spacing');
                    }
                    return startInChain;
                }
            } else {
                if(index === 0) {
                    return control.getStartWithMargin(true);
                } else {
                    return controls.get('firstObject.startWithMargin');
                }
            }
        } else {
            return 0;
        }
    },

    getEndInChain: function(controlId, value, forXml) {
        if(this.get('valid')) {
            var controls = this.get('uiPhoneControls');
            var control = controls.findBy('id', controlId);
            if(this.get('axis') === 'horizontal') {
                // Case type: weighted
                if(this.get('type') === 'weighted') {
                    var availableSpace;
                    if(forXml) {
                        availableSpace = this.getAvailableSpace(this.get('viewController.width'), this.get('viewController.height'));
                    } else {
                        availableSpace = this.get('availableSpace');
                    }
                    var width = availableSpace / this.get('totalValue') * value;
                    var endInChain = parseFloat(control.get('start')) + width + parseFloat(control.get('marginEnd'));
                    return endInChain;
                } else if(this.get('type') === 'spread') {
                    // Case type: spread
                    return (parseFloat(control.get('startWithMargin')) + parseFloat(control.get('outerWidth')));
                } else if(this.get('type') === 'spread_inside') {
                    // Case type: spread_inside
                    return (parseFloat(control.get('startWithMargin')) + parseFloat(control.get('outerWidth')));
                } else if(this.get('type') === 'packed') {
                    // Case type: packed
                    return (parseFloat(control.get('startWithMargin')) + parseFloat(control.get('outerWidth')));
                }
            } else {
                return parseFloat(control.getEnd(true));
            }
        } else {
            return 0;
        }
    },

    canMarginTopBeChanged: function(id) {
        if(this.get('valid')) {
            if(this.get('type') === 'spread' || this.get('type') === 'packed') {
                return false;
            }
            var controls = this.get('uiPhoneControls');
            var control = controls.findBy('id', id);
            var index = controls.indexOf(control);
            return index === 0;
        } else {
            return true;
        }
    },

    canMarginBottomBeChanged: function(id) {
        if(this.get('valid')) {
            if(this.get('type') === 'spread' || this.get('type') === 'packed') {
                return false;
            }
            var controls = this.get('uiPhoneControls');
            var control = controls.findBy('id', id);
            var index = controls.indexOf(control);
            return index === (controls.get('length') - 1);
        } else {
            return true;
        }
    },

    canMarginStartBeChanged: function(id) {
        if(this.get('valid')) {
            if(this.get('type') === 'spread' || this.get('type') === 'packed') {
                return false;
            }
            var controls = this.get('uiPhoneControls');
            var control = controls.findBy('id', id);
            var index = controls.indexOf(control);
            return index === 0;
        } else {
            return true;
        }
    },

    canMarginEndBeChanged: function(id) {
        if(this.get('valid')) {
            if(this.get('type') === 'spread' || this.get('type') === 'packed') {
                return false;
            }
            var controls = this.get('uiPhoneControls');
            var control = controls.findBy('id', id);
            var index = controls.indexOf(control);
            return index === (controls.get('length') - 1);
        } else {
            return true;
        }
    },

    getHorizontalSpaceForControls: function() {
        var controls = this.get('uiPhoneControls');
        var spaceForControls = 0;
        controls.forEach(function(c) {
            spaceForControls = spaceForControls + parseFloat(c.get('outerWidth'));
        });
        if(this.get('type') === 'weighted' || this.get('type') === 'packed') {
            spaceForControls = spaceForControls - ((controls.get('length') + 1) * this.get('spacing'));
        }
        return spaceForControls;
    },

    getIndex: function(control) {
        return this.get('uiPhoneControls').indexOf(control);
    },

    getPrecedentControl: function(control) {
        var index = this.get('uiPhoneControls').indexOf(control);
        if(index === 0) {
            return null;
        }
        return this.get('uiPhoneControls.content.' + (index - 1));
    },

    getFollowingControl: function(control) {
        var index = this.get('uiPhoneControls').indexOf(control);
        if(index === (this.get('uiPhoneControls.length') - 1)) {
            return null;
        }
        return this.get('uiPhoneControls.content.' + (index + 1));
    },

    didCreate: function () {
        this._super();
        this.set('name', 'id' + this.get('id') + 'Chain');
        this.save();
    },

    delete: function () {
        this.get('uiPhoneControls').forEach(function (uiPhoneControl) {
            Ember.run.once(this, function () {
                if(!uiPhoneControl.get('isDeleted')) {
                    uiPhoneControl.deleteRecord();
                    uiPhoneControl.save();
                }
            });
        });

        this.deleteRecord();
    },

    toXml: function (xmlDoc) {
        var chain = xmlDoc.createElement(this.get('xmlName'));
        chain.setAttribute('id', this.get('name'));
        chain.setAttribute('viewController', this.get('viewController').getRefPath(''));
        chain.setAttribute('axis', this.get('axis'));
        chain.setAttribute('type', this.get('type'));
        chain.setAttribute('nControls', this.get('uiPhoneControls.length'));
        if(this.get('type') === 'packed') {
            chain.setAttribute('bias', this.get('bias'));
        }
        if(this.get('type') === 'packed' || this.get('type') === 'weighted') {
            chain.setAttribute('spacing', this.get('spacing'));
        }

        /*var self = this;
        this.get('uiPhoneControls').forEach(function (uiPhoneControl) {
            var control = xmlDoc.createElement(self.get('xmlNameChild'));
            control.setAttribute('controlChain', self.getRefPath(''));
            control.setAttribute('uiPhoneControl', uiPhoneControl.getRefPath(''));
            chain.appendChild(control);
        });*/

        return chain;
    },

    getRefPath: function (path) {
        var updatedPath = '/@' + this.get('xmlName') + '[id=\'' + this.get('name') + '\']' + path;
        updatedPath = this.get('viewController').getRefPath(updatedPath);
        return updatedPath;
    },
});
