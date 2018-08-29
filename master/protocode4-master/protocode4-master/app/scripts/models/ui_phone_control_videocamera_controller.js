App.VideocameraController = App.UiPhoneControl.extend({
    videoView: DS.belongsTo('videoView', {inverse: null}),
    minWidth: 64,
    minHeight: 40,
    defaultWidth: 120,
    defaultHeight: 40,

    widthFixed: DS.attr('number', {defaultValue: 120}),
    heightFixed: DS.attr('number', {defaultValue: 40}),

    backgroundType: DS.attr('string', {defaultValue: 'normal'}),

    xmlName: 'videocameraController',

    isNormalBackType: function () {
        return this.get('backgroundType') === 'normal';
    }.property('backgroundType'),

    isIconBackType: function () {
        return this.get('backgroundType') === 'icon';
    }.property('backgroundType'),

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, elem);

        elem.setAttribute('backgroundType', this.get('backgroundType'));

        var videoView = this.get('videoView');

        if (videoView !== null) {
            elem.setAttribute('videoViewId', videoView.get('name'));
        }

        return elem;
    },

    // Override because there's only one PhotocameraController
    getRefPath: function (path) {
        var updatedPath = '/@' + this.get('xmlName');
        updatedPath = this.get('viewController').getRefPath(updatedPath);
        return updatedPath;
    }
});
