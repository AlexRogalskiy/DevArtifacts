App.UiWatchControl = App.UiControl.extend({
    width: DS.attr('number', {defaultValue: 125}),
    height: DS.attr('number', {defaultValue: 48}),

    order: DS.attr('number', {defaultValue: 0}),

    watchController: DS.belongsTo('watchController'),
    parentContainer: DS.belongsTo('container', {inverse: 'uiWatchControls'}),

    alignParentTop: DS.attr('boolean', {defaultValue: false}),
    alignParentBottom: DS.attr('boolean', {defaultValue: false}),
    alignParentStart: DS.attr('boolean', {defaultValue: true}),
    alignParentEnd: DS.attr('boolean', {defaultValue: true}),

    alignTop: DS.belongsTo('uiWatchControl', {polymorphic: true, inverse: null}),
    alignBottom: DS.belongsTo('uiWatchControl', {polymorphic: true, inverse: null}),
    alignStart: DS.belongsTo('uiWatchControl', {polymorphic: true, inverse: null}),
    alignEnd: DS.belongsTo('uiWatchControl', {polymorphic: true, inverse: null}),

    above: DS.belongsTo('uiWatchControl', {polymorphic: true, inverse: null}),
    below: DS.belongsTo('uiWatchControl', {polymorphic: true, inverse: null}),
    toStartOf: DS.belongsTo('uiWatchControl', {polymorphic: true, inverse: null}),
    toEndOf: DS.belongsTo('uiWatchControl', {polymorphic: true, inverse: null}),

    sameLevelControls: function () {
        var parentContainer = this.get('parentContainer');

        if (parentContainer !== null) {
            return parentContainer.get('uiWatchControls');
        }

        return this.get('watchController.uiWatchControls');
    }.property(
        'parentContainer.uiWatchControls.@each',
        'watchController.uiWatchControls.@each'),

    siblings: function () {
        if (this.get('sameLevelControls') !== null) {
            return this.get('sameLevelControls').without(this);
        }

        return null;
    }.property('sameLevelControls'),

    top: function () {
        if (this.get('alignTop')) {
            return this.get('alignTop.top');
        }
        else if (this.get('below')) {
            return this.get('below.bottom');
        }
        else if (this.get('alignParentTop')) {

            if (this.get('parentContainer') !== null) {
                return 0;
            }
            else {
                // Offset of top bar
                return this.get('watchController.application.smartwatch.viewTop');
            }

        }
        else if (this.get('alignBottom')) {
            return this.get('alignBottom.bottom') - this.get('outerHeight');
        }
        else if (this.get('alignParentBottom')) {

            if (this.get('parentContainer') !== null) {
                return this.get('bottom') - this.get('outerHeight');
            }
            else {
                return this.get('bottom') - this.get('outerHeight');
            }

        }
        else if (this.get('above')) {
            return this.get('bottom') - this.get('outerHeight');
        }
        else {

            if (this.get('parentContainer') !== null) {
                return parseFloat(this.get('posY'));
            }
            else {
                // Offset of top bar
                return parseFloat(this.get('posY')) + this.get('watchController.application.smartwatch.viewTop');
            }

        }
    }.property(
        'posY',
        'outerHeight',
        'alignTop.top',
        'alignParentTop',
        'alignBottom.bottom',
        'alignParentBottom',
        'below.bottom',
        'watchController.application.smartwatch.viewTop',
        'above',
        'bottom'),

    bottom: function () {
        if (this.get('alignBottom')) {
            return this.get('alignBottom.bottom');
        }
        else if (this.get('alignParentBottom')) {

            if (this.get('parentContainer') !== null) {
                return this.get('parentContainer.height');
            }
            else {
                // Offset bottom
                return this.get('watchController.application.smartwatch.viewBottom');

            }

        }
        else if (this.get('above')) {
            return this.get('above.top');
        }
        else {
            return this.get('top') + parseFloat(this.get('outerHeight'));
        }
    }.property(
        'alignBottom.bottom',
        'alignParentBottom',
        'top',
        'outerHeight',
        'parentContainer.height',
        'above.top',
        'watchController.application.smartwatch.viewBottom'),

    start: function () {
        if (this.get('alignStart')) {
            return this.get('alignStart.start');
        }
        else if (this.get('toEndOf')) {
            return this.get('toEndOf.end');
        }
        else if (this.get('alignParentStart')) {
            return 0;
        }
        else if (this.get('alignEnd')) {
            return this.get('alignEnd.end') - this.get('outerWidth');
        }
        else if (this.get('alignParentEnd')) {

            if (this.get('parentContainer') !== null) {
                return this.get('parentContainer.width') - this.get('outerWidth');
            }
            else {
                return this.get('watchController.application.smartwatch.screenWidth') - this.get('outerWidth');
            }

        }
        else if (this.get('toStartOf')) {
            return this.get('end') - this.get('outerWidth');
        }
        else {
            return parseFloat(this.get('posX'));
        }
    }.property(
        'posX',
        'outerWidth',
        'parentContainer',
        'alignStart.start',
        'toEndOf.end',
        'alignEnd.end',
        'alignParentStart',
        'alignParentEnd',
        'toStartOf',
        'end',
        'watchController.application.smartwatch.screenWidth'),

    end: function () {
        if (this.get('alignEnd')) {
            return this.get('alignEnd.end');
        }
        else if (this.get('alignParentEnd')) {

            if (this.get('parentContainer') !== null) {
                return this.get('parentContainer.width');
            }
            else {
                return this.get('watchController.application.smartwatch.screenWidth');
            }

        }
        else if (this.get('toStartOf')) {
            return this.get('toStartOf.start');
        }
        else {
            return this.get('start') + parseFloat(this.get('outerWidth'));
        }
    }.property(
        'alignEnd',
        'alignParentEnd',
        'start',
        'parentContainer',
        'toStartOf.start',
        'outerWidth',
        'watchController.application.smartwatch.screenWidth'),

    computedWidth: function () {
        return parseFloat(this.get('end')) -
            parseFloat(this.get('start')) -
            parseFloat(this.get('marginStart')) -
            parseFloat(this.get('marginEnd'));
    }.property(
        'start',
        'end',
        'marginStart',
        'paddingStart',
        'paddingEnd',
        'marginEnd'),

    computedHeight: function () {
        return parseFloat(this.get('bottom')) -
            parseFloat(this.get('top')) -
            parseFloat(this.get('marginTop')) -
            parseFloat(this.get('marginBottom'));
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

    // Used to reload views
    didCreate: function () {
        this.set('name', this.get('id').replace(/[0-9]/g, '') + this.constructor.toString().split(".")[1]);

        var self = this;
        if (this.get('parentContainer')) {
            var uiWatchControls = this.get('parentContainer.uiWatchControls');
            uiWatchControls.pushObject(self);
            this.get('parentContainer').save();
        }
        else {
            var watchController = this.get('watchController');
            watchController.get('uiWatchControls').then(function (uiWatchControls) {
                uiWatchControls.pushObject(self);
                watchController.save();
            });

            this.save();

        }
    },

    deleteRecord: function () {
        var watchController = this.get('watchController');
        var self = this;

        if (watchController) {
            var constraints = [
                'below'
            ];


            // Removes constraints related to the uiwatchcontrol that is going to be deleted
            watchController.get('uiWatchControls').then(function (uiWatchControls) {
                uiWatchControls.forEach(function (uiWatchControl, index) {
                    constraints.forEach(function (constraint) {
                        //If uiWatchControl was below the control to be deleted
                        if (uiWatchControl.get(constraint) === self) {
                            //Reset the below-to hierarchy
                            uiWatchControl.set(constraint, uiWatchControls.content[index - 1]);
                            uiWatchControl.save();
                        }
                    });
                });
            });

            // Reset first uiwatchcontrol to alignParentTop
            watchController.get('uiWatchControls').then(function (uiWatchControls) {
                uiWatchControls.forEach(function (uiWatchControl) {
                    if (uiWatchControl === uiWatchControls.get('firstObject')) {
                        uiWatchControl.set('alignParentTop', true);
                        uiWatchControl.save();
                    }
                });
            });


        }

        this._super();
    },

    decorateXml: function (xmlElem) {
        xmlElem.setAttribute('id', this.get('name'));

        xmlElem.setAttribute('order', this.get('order'));

        xmlElem.setAttribute('posX', this.get('posX'));
        xmlElem.setAttribute('posY', this.get('posY'));

        xmlElem.setAttribute('width', this.get('width'));
        xmlElem.setAttribute('height', this.get('height'));

        xmlElem.setAttribute('paddingTop', this.get('paddingTop'));
        xmlElem.setAttribute('paddingBottom', this.get('paddingBottom'));
        xmlElem.setAttribute('paddingStart', this.get('paddingStart'));
        xmlElem.setAttribute('paddingEnd', this.get('paddingEnd'));

        xmlElem.setAttribute('marginTop', this.get('marginTop'));
        xmlElem.setAttribute('marginBottom', this.get('marginBottom'));
        xmlElem.setAttribute('marginStart', this.get('marginStart'));
        xmlElem.setAttribute('marginEnd', this.get('marginEnd'));

        xmlElem.setAttribute('alignParentTop', this.get('alignParentTop'));
        xmlElem.setAttribute('alignParentBottom', this.get('alignParentBottom'));
        xmlElem.setAttribute('alignParentStart', this.get('alignParentStart'));
        xmlElem.setAttribute('alignParentEnd', this.get('alignParentEnd'));

        if (this.get('alignTop')) {
            xmlElem.setAttribute('alignTop', this.get('alignTop').getRefPath(''));
        }
        if (this.get('alignBottom')) {
            xmlElem.setAttribute('alignBottom', this.get('alignBottom').getRefPath(''));
        }
        if (this.get('alignStart')) {
            xmlElem.setAttribute('alignStart', this.get('alignStart').getRefPath(''));
        }
        if (this.get('alignEnd')) {
            xmlElem.setAttribute('alignEnd', this.get('alignEnd').getRefPath(''));
        }

        if (this.get('above')) {
            xmlElem.setAttribute('above', this.get('above').getRefPath(''));
        }
        if (this.get('below')) {
            xmlElem.setAttribute('below', this.get('below').getRefPath(''));
        }
        if (this.get('toStartOf')) {
            xmlElem.setAttribute('toStartOf', this.get('toStartOf').getRefPath(''));
        }
        if (this.get('toEndOf')) {
            xmlElem.setAttribute('toEndOf', this.get('toEndOf').getRefPath(''));
        }

        if (this.get('watchController')) {
            xmlElem.setAttribute('watchController', this.get('watchController').getRefPath(''));
        }

        return xmlElem;
    },

    getRefPath: function (path) {
        var updatedPath = '/@' + this.get('xmlName') + '[id=\'' + this.get('name') + '\']';

        if (this.get('parentContainer') !== null) {
            updatedPath = this.get('parentContainer').getRefPath(updatedPath);
        }
        else {
            updatedPath = this.get('watchController').getRefPath(updatedPath);
        }

        return updatedPath;
    },

    getRelatedUiWatchControls: function () {
        var constraints = [
            'alignTop',
            'alignBottom',
            'alignStart',
            'alignEnd',
            'above',
            'below',
            'toStartOf',
            'toEndOf'];

        var self = this;

        return constraints.map(function (constraint) {
            return self.get(constraint);
        }).filter(function (item) {
            return item !== null;
        });

    }

});
