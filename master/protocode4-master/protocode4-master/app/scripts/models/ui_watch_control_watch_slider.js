App.WatchSlider = App.UiWatchControl.extend({
    name: DS.attr('string', {defaultValue: 'Slider'}),

    xmlName: 'watchSliders',

    toXml: function (xmlDoc) {
        var slider = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(slider);
        return slider;
    }

});
