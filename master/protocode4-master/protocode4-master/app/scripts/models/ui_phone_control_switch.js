App.Switch = App.UiPhoneControl.extend({
    name: DS.attr('string', {defaultValue: 'Switch'}),
    minWidth: 51,
    minHeight: 36,
    defaultWidth: 51,
    defaultHeight: 36,

    widthFixed: DS.attr('number', {defaultValue: 51}),
    heightFixed: DS.attr('number', {defaultValue: 36}),

    xmlName: 'switches',

    toXml: function (xmlDoc) {
        var _switch = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, _switch);
        return _switch;
    }

});
