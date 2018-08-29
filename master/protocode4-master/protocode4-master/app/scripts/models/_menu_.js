App.Menu = DS.Model.extend({
    menuItems: DS.hasMany('menuItem', {inverse: 'parentMenu'}),

    deleteRecord: function () {
        this.get('menuItems').forEach(function (item) {
            Ember.run.once(this, function () {
                item.deleteRecord();
                item.save();
            });
        });

        this._super();
    },

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement('menu');

        this.get('menuItems').map(function (item) {
            elem.appendChild(item.toXml(xmlDoc));
        });

        return elem;
    }
});
