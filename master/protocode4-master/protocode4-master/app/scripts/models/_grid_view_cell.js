App.GridViewCell = DS.Model.extend({
    name: DS.attr('string', {defaultValue: 'GridView1'}),
    title: DS.attr('string', {defaultValue: 'Grid View'}),

    parentGridView: DS.belongsTo('gridView', {inverse: 'gridViewCells'}),

    isWithImage: function () {
        return this.get('parentGridView.gridType') === 'image';
    }.property('parentGridView.gridType'),

    isDetailed: function () {
        return this.get('parentGridView.gridType') === 'detailed';
    }.property('parentGridView.gridType'),

    // Used to reload menuItems
    didCreate: function () {
        this._super();

        this.get('parentGridView.gridViewCells').pushObject(this);
        this.get('parentGridView').save();
    },

    toXml: function (xmlDoc) {
        var elem = xmlDoc.createElement('gridViewCells');

        elem.setAttribute('title', this.get('title'));

        return elem;
    }
});
