App.ListViewCell = DS.Model.extend({
    name: DS.attr('string', {defaultValue: 'ListView1'}),
    title: DS.attr('string', {defaultValue: 'List View'}),
    subtitle: DS.attr('string', {defaultValue: 'Content'}),

    parentListView: DS.belongsTo('listView', {inverse: 'listViewCells'}),

    isWithImage: function () {
        return this.get('parentListView.listType') === 'image';
    }.property('parentListView.listType'),

    isDetailed: function () {
        return this.get('parentListView.listType') === 'detailed';
    }.property('parentListView.listType'),

    // Used to reload menuItems
    didCreate: function () {
        this._super();

        this.get('parentListView.listViewCells').pushObject(this);
        this.get('parentListView').save();
    },

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement('listViewCells');

        elem.setAttribute('title', this.get('title'));
        elem.setAttribute('subtitle', this.get('subtitle'));

        return elem;
    }
});
