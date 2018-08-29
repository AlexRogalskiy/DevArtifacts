App.WatchLabel = App.UiWatchControl.extend({
    name: DS.attr('string', {defaultValue: 'Label'}),
    title: DS.attr('string', {defaultValue: 'Label'}),

    textAlign: DS.attr('string', {defaultValue: 'center'}),
    textDecoration: DS.attr('string', {defaultValue: 'none'}),

    xmlName: 'watchTextViews',

    isBold: function () {
        return this.get('textDecoration') === 'bold';
    }.property('textDecoration'),

    isItalic: function () {
        return this.get('textDecoration') === 'italic';
    }.property('textDecoration'),

    toXml: function (xmlDoc) {
        var label = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(label);
        label.setAttribute('content', this.get('title'));
        label.setAttribute('textAlign', this.get('textAlign'));
        label.setAttribute('textDecoration', this.get('textDecoration'));

        return label;
    }
});
