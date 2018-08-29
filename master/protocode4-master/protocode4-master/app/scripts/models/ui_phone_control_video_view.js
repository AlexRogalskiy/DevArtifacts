App.VideoView = App.UiPhoneControl.extend({
    sourceType: DS.belongsTo('sourceType', {inverse: null}),
    minWidth: 0,
    minHeight: 0,
    defaultWidth: 240,
    defaultHeight: 128,

    widthFixed: DS.attr('number', {defaultValue: 240}),
    heightFixed: DS.attr('number', {defaultValue: 128}),

    xmlName: 'videoViews',

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
                if (uiPhoneControl && uiPhoneControl.get('videoView') === self) {
                    uiPhoneControl.set('videoView', null);
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

    // Override because there's only one videoView
    /*
     getRefPath: function(path) {
     var updatedPath = '/@' + this.get('xmlName');

     if (this.get('parentContainer') != null) {
     updatedPath = this.get('parentContainer').getRefPath(updatedPath);
     }
     else {
     updatedPath = this.get('viewController').getRefPath(updatedPath);
     }

     return updatedPath;
     }
     */
});

/*
 App.VideoView.FIXTURES = [
 {
 id: 7,
 sourceType: 1,
 name: 'VideoView1',
 posX: 100,
 posY: 400,
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
 width: 200,
 height: 100,
 viewController: 1,
 parentContainer: null
 }
 ];*/
