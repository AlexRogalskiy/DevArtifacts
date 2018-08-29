App.Timepicker = App.UiPhoneControl.extend({
    name: DS.attr('string', {defaultValue: 'Timepicker'}),
    minWidth: 346,
    minHeight: 346,
    defaultWidth: 346,
    defaultHeight: 346,

    widthFixed: DS.attr('number', {defaultValue: 346}),
    heightFixed: DS.attr('number', {defaultValue: 346}),

    xmlName: 'timepickers',

    toXml: function (xmlDoc) {
        var timepicker = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, timepicker);
        return timepicker;
    }

});
