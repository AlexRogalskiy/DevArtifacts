App.SourceType = DS.Model.extend({

    type: DS.attr('string', {defaultValue: 'hardwareFile'}),
    fileUri: DS.attr('string', {defaultValue: ''}),

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement('sourceType');

        elem.setAttribute('sourceType', this.get('type'));

        if (this.get('type') === 'hardwareFile') {
            elem.setAttribute('fileUri', '');
        } else {
            elem.setAttribute('fileUri', this.get('fileUri'));
        }

        return elem;
    }
});
