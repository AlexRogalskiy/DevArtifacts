App.Label = App.UiPhoneControl.extend({
    name: DS.attr('string', {defaultValue: 'Label'}),
    title: DS.attr('string', {defaultValue: 'Label'}),
    minWidth: 88,
    minHeight: 24,
    defaultWidth: 88,
    defaultHeight: 36,
    widthFixed: DS.attr('number', {defaultValue: 88}),
    heightFixed: DS.attr('number', {defaultValue: 36}),

    textAlign: DS.attr('string', {defaultValue: 'left'}),
    textColor: DS.attr('string', {defaultValue: '#000000'}),
    textSize: DS.attr('number', {defaultValue: 16}),
    textDecoration: DS.attr('string', {defaultValue: 'none'}),

    xmlName: 'textViews',

    isBold: function () {
        return this.get('textDecoration') === 'bold';
    }.property('textDecoration'),

    isItalic: function () {
        return this.get('textDecoration') === 'italic';
    }.property('textDecoration'),

    toXml: function (xmlDoc) {
        var label = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(xmlDoc, label);
        label.setAttribute('content', this.get('title'));
        label.setAttribute('textAlign', this.get('textAlign'));

        label.setAttribute('textColor', this.get('textColor'));
        label.setAttribute('textSize', this.get('textSize'));
        label.setAttribute('textDecoration', this.get('textDecoration'));

        return label;
    }
});
