App.WatchButton = App.UiWatchControl.extend({
    title: DS.attr('string', {defaultValue: 'Button'}),
    watchClickListener: DS.belongsTo('watchClickListener'),

    xmlName: 'watchButtons',

    deleteRecord: function () {
        var watchClickListener = this.get('watchClickListener');

        if (watchClickListener) {
            watchClickListener.deleteRecord();
            watchClickListener.save();
        }

        this._super();
    },

    toXml: function (xmlDoc) {
        var button = xmlDoc.createElement(this.get('xmlName'));
        this.decorateXml(button);
        button.setAttribute('title', this.get('title'));

        var watchClickListener = this.get('watchClickListener');

        if (watchClickListener !== null) {
            button.appendChild(watchClickListener.toXml(xmlDoc));
        }

        return button;
    }
});
