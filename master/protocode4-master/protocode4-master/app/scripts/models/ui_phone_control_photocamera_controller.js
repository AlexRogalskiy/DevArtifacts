App.PhotocameraController = App.UiPhoneControl.extend({
    imageView: DS.belongsTo('imageView', {inverse: null}),
    minWidth: 64,
    minHeight: 40,
    defaultWidth: 120,
    defaultHeight: 40,
    widthFixed: DS.attr('number', {defaultValue: 120}),
    heightFixed: DS.attr('number', {defaultValue: 40}),

    backgroundType: DS.attr('string', {defaultValue: 'normal'}),

    xmlName: 'photocameraController',

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

        var imageView = this.get('imageView');

        if (imageView !== null) {
            elem.setAttribute('imageViewId', imageView.get('name'));
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
