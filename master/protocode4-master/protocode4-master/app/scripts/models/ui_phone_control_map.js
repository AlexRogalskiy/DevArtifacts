App.Map = App.UiPhoneControl.extend({
    name: DS.attr('string', {defaultValue: 'Map'}),
    minWidth: 0,
    minHeight: 0,
    defaultWidth: 200,
    defaultHeight: 330,
    widthFixed: DS.attr('number', {defaultValue: 200}),
    heightFixed: DS.attr('number', {defaultValue: 330}),

    lat: DS.attr('number', {defaultValue: 45.478}),
    lon: DS.attr('number', {defaultValue: 9.227}),

    xmlName: 'map',

    toXml: function (xmlDoc) {
        var map = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, map);

        map.setAttribute('lat', this.get('lat'));
        map.setAttribute('lon', this.get('lon'));

        return map;
    },

    // Override because there's only one Map
    getRefPath: function (path) {
        var updatedPath = '/@' + this.get('xmlName');
        updatedPath = this.get('viewController').getRefPath(updatedPath);
        return updatedPath;
    }

});
