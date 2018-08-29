App.Constraint = DS.Model.extend({
    layoutEdges: ['top', 'bottom', 'start', 'end', 'centerX', 'centerY'],

    uiPhoneControl: DS.belongsTo('uiPhoneControl', {polymorphic: true, inverse: 'constraints'}),

    name: DS.attr('string'),
    layoutEdge: DS.attr('string'),
    withParent: DS.attr('boolean'),
    referenceElement: DS.belongsTo('uiPhoneControl', {polymorphic: true, inverse: null}),
    referenceLayoutEdge: DS.attr('string'),
    valid: DS.attr('boolean'),
    flag: DS.attr('boolean', {defaultValue: false}),

    xmlName: 'positionConstraints',

    filteredLayoutEdges: function() {
        var edges = this.get('layoutEdges');
        var constraints = this.get('uiPhoneControl.constraints');
        if(constraints) {
            constraints = constraints.without(this);
            constraints.forEach(function (constraint) {
                edges = edges.without(constraint.get('layoutEdge'));
            });
            if(this.get('uiPhoneControl.controlChain')) {
                if(this.get('uiPhoneControl.controlChain.axis') === 'horizontal') {
                    edges = edges.without('centerX').without('start').without('end');
                } else if(this.get('uiPhoneControl.controlChain.axis') === 'vertical') {
                    edges = edges.without('centerY').without('top').without('bottom');
                }
            }
        }
        return edges;
    }.property(
        'layoutEdges',
        'uiPhoneControl.constraints.@each',
        'uiPhoneControl.controlChain',
        'uiPhoneControl.controlChain.axis'
    ),

    filteredReferenceLayoutEdges: function() {
        var wp = this.get('withParent');
        var firstEdge = this.get('layoutEdge');
        if(firstEdge === 'top' || firstEdge === 'bottom') {
            if(wp) {
                return [firstEdge];
            } else {
                return ['top', 'bottom'];
            }
        } else if(firstEdge === 'start' || firstEdge === 'end') {
            if(wp) {
                return [firstEdge];
            } else {
                return ['start', 'end'];
            }
        } else if(firstEdge === 'centerX') {
            return ['centerX'];
        } else if(firstEdge === 'centerY') {
            return ['centerY'];
        } else {
            return [];
        }
    }.property('withParent', 'layoutEdge', 'referenceLayoutEdge'),

    firstEdgeChanged: function() {
        if(!(this.get('isDeleted'))) {
            this.set('referenceLayoutEdge', null);
        }
    }.observes('layoutEdge'),

    referenceElementOrWithParentChanged: function() {
        if(!(this.get('isDeleted'))) {
            this.set('flag', true);
        }
    }.observes('referenceElement', 'withParent'),

    somethingChanged: function() {
        if(!(this.get('isDeleted'))) {
            this.set('valid', false);
        }
    }.observes('layoutEdge', 'referenceElement', 'referenceLayoutEdge', 'withParent'),

    didCreate: function () {
        this._super();
        this.set('flag', false);
        this.save();

        this.get('uiPhoneControl').save();
    },

    toXml: function (xmlDoc) {
        var constraint = xmlDoc.createElement(this.get('xmlName'));
        constraint.setAttribute('id', this.get('id'));
        constraint.setAttribute('uiPhoneControl', this.get('uiPhoneControl').getRefPath(''));
        constraint.setAttribute('layoutEdge', this.get('layoutEdge'));
        constraint.setAttribute('withParent', this.get('withParent'));
        if(!this.get('withParent')) {
            constraint.setAttribute('referenceElement', this.get('referenceElement').getRefPath(''));
        }
        constraint.setAttribute('referenceLayoutEdge', this.get('referenceLayoutEdge'));

        return constraint;
    }

});
