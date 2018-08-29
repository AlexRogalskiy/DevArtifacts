App.ImageView = App.UiPhoneControl.extend({
    sourceType: DS.belongsTo('sourceType', {inverse: null}),
    minWidth: 0,
    minHeight: 0,
    defaultWidth: 240,
    defaultHeight: 128,
    widthFixed: DS.attr('number', {defaultValue: 240}),
    heightFixed: DS.attr('number', {defaultValue: 128}),

    xmlName: 'imageViews',

    didCreate: function () {
        this._super();

        var sourceType = this.store.createRecord('sourceType');
        this.set('sourceType', sourceType);
        sourceType.save();
        this.save();
    },

    deleteRecord: function () {
        var sourceType = this.get('sourceType');

        if (sourceType) {
            sourceType.deleteRecord();
            sourceType.save();
        }

        var viewController = this.get('viewController');

        var self = this;

        if (viewController) {
            viewController.get('uiPhoneControls').forEach(function (uiPhoneControl) {
                if (uiPhoneControl && uiPhoneControl.get('imageView') === self) {
                    uiPhoneControl.set('imageView', null);
                    uiPhoneControl.save();
                }
            });
        }


        this._super();
    },

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, elem);

        var sourceType = this.get('sourceType');

        if (sourceType !== null) {
            var sourceTypeAttrs = sourceType.toXml(xmlDoc).attributes;

            for (var i = 0; i < sourceTypeAttrs.length; i++) {
                var attr = sourceTypeAttrs[i];
                elem.setAttribute(attr.name, attr.value);
            }
        }

        return elem;
    }
});
/*
 App.ImageView.FIXTURES = [
 {
 id: 6,
 sourceType: 1,
 name: 'ImageView1',
 posX: 200,
 posY: 300,
 paddingTop: 8,
 paddingBottom: 8,
 paddingStart: 8,
 paddingEnd: 8,
 marginTop: 0,
 marginBottom: 0,
 marginStart: 0,
 marginEnd: 0,
 alignParentTop: false,
 alignParentBottom: false,
 alignParentStart: false,
 alignParentEnd: false,
 width: 100,
 height: 100,
 viewController: 1,
 parentContainer: null
 }
 ];*/
