App.AudioPlayer = App.UiPhoneControl.extend({
    sourceType: DS.belongsTo('sourceType', {inverse: null}),
    minWidth: 250,
    minHeight: 75,
    defaultWidth: 250,
    defaultHeight: 75,
    widthFixed: DS.attr('number', {defaultValue: 250}),
    heightFixed: DS.attr('number', {defaultValue: 75}),

    xmlName: 'audioPlayers',

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
                if (uiPhoneControl && uiPhoneControl.get('audioPlayer') === self) {
                    uiPhoneControl.set('audioPlayer', null);
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

    /*
     // Override because there's only one AudioPlayer
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
 App.AudioPlayer.FIXTURES = [];
 */
