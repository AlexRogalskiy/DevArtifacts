App.WatchVoiceMessage = App.UiWatchControl.extend({
    name: DS.attr('string', {defaultValue: 'VoiceMessage'}),
    title: DS.attr('string', {defaultValue: 'REC'}),

    xmlName: 'watchVoiceMessages',

    toXml: function (xmlDoc) {
        var vmessage = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(vmessage);
        vmessage.setAttribute('title', this.get('title'));
        return vmessage;
    },

    // Override because there's only one WatchVoiceMessage
    getRefPath: function (path) {
        var updatedPath = '/@' + this.get('xmlName');

        if (this.get('parentContainer') !== null) {
            updatedPath = this.get('parentContainer').getRefPath(updatedPath);
        }
        else {
            updatedPath = this.get('watchController').getRefPath(updatedPath);
        }

        return updatedPath;
    }

});
