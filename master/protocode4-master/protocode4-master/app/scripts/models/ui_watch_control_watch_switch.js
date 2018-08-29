App.WatchSwitch = App.UiWatchControl.extend({
    name: DS.attr('string', {defaultValue: 'Label'}),
    title: DS.attr('string', {defaultValue: 'Switch Label'}),

    xmlName: 'watchSwitches',

    toXml: function (xmlDoc) {
        var _switch = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(_switch);
        _switch.setAttribute('title', this.get('title'));
        return _switch;
    }
});
