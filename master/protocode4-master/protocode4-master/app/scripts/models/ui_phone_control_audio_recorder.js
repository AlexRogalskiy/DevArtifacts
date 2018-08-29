App.AudioRecorder = App.UiPhoneControl.extend({
    audioPlayer: DS.belongsTo('audioPlayer', {inverse: null}),
    minWidth: 64,
    minHeight: 40,
    defaultWidth: 88,
    defaultHeight: 40,
    widthFixed: DS.attr('number', {defaultValue: 88}),
    heightFixed: DS.attr('number', {defaultValue: 40}),

    xmlName: 'audioRecorder',

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, elem);

        var audioPlayer = this.get('audioPlayer');

        if (audioPlayer !== null) {
            elem.setAttribute('audioPlayerId', audioPlayer.get('name'));
        }

        return elem;
    },

    // Override because there's only one AudioRecorder
    getRefPath: function (path) {
        var updatedPath = '/@' + this.get('xmlName');
        updatedPath = this.get('viewController').getRefPath(updatedPath);
        return updatedPath;
    }
});
