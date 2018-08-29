App.Container = App.UiPhoneControl.extend({
    minWidth: 0,
    minHeight: 0,
    defaultWidth: 300,
    defaultHeight: 400,
    widthFixed: DS.attr('number', {defaultValue: 300}),
    heightFixed: DS.attr('number', {defaultValue: 400}),

    childViewController: DS.belongsTo('viewController', {inverse: null}),

    xmlName: "containers",

    getWidthFromPercent: function(widthPercent) {
        return widthPercent * this.get('width');
    },

    getHeightFromPercent: function(heightPercent) {
        return heightPercent * this.get('height');
    },

    didCreate: function () {
        this.set('name', 'id' + this.get('id') + this.constructor.toString().split(".")[1]);
        this.save();
    },

    deleteFromScene: function() {
        var self = this;
        this.get('bindedControls').forEach(function(control) {
            control.get('bindedControls').removeObject(self);
            control.get('constraints').forEach(function(c) {
                if(c.get('referenceElement') === self) {
                    c.deleteRecord();
                    c.save();
                }
            });
            control.save();
        });
        this.deleteRecord();
        this.save();
    },

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement(this.get('xmlName'));
        elem.setAttribute('childViewController', this.get('childViewController').getRefPath(''));
        this.decorateXml(xmlDoc, elem);

        return elem;
    }
});
