App.Slider = App.UiPhoneControl.extend({
    name: DS.attr('string', {defaultValue: 'Slider'}),
    minWidth: 150,
    minHeight: 50,
    defaultWidth: 150,
    defaultHeight: 50,
    widthFixed: DS.attr('number', {defaultValue: 150}),
    heightFixed: DS.attr('number', {defaultValue: 50}),

    xmlName: 'sliders',

    toXml: function (xmlDoc) {
        var slider = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, slider);
        return slider;
    }

});
