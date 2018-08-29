App.WatchNavigation = DS.Model.extend({
    destination: DS.belongsTo('watchController', {inverse: null}),

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement('watchNavigation');

        elem.setAttribute('destination', this.get('destination.name'));

        return elem;
    }
});
