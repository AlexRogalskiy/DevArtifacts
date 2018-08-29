App.WatchClickListener = DS.Model.extend({
    watchNavigation: DS.belongsTo('watchNavigation'),

    deleteRecord: function () {
        var watchNavigation = this.get('watchNavigation');

        if (watchNavigation) {
            watchNavigation.deleteRecord();
            watchNavigation.save();
        }

        this._super();
    },

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement('watchClickListener');

        var watchNavigation = this.get('watchNavigation');

        if (watchNavigation !== null) {
            elem.appendChild(watchNavigation.toXml(xmlDoc));
        }

        return elem;
    }
});
