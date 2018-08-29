/*
 templates/control_grid_view/index.hbs
 */
App.ControlGridViewIndexController = App.UiPhoneControlController.extend(App.Saveable, App.Navigable, {
    needs: ['scenes'],

    isCreating: false,
    newNameGridViewCell: 'newGridCell',

    widthCanBeConstrained: function() {
        return false;
    }.property('model'),

    simpleGrid: function (key, value) {
        return this.gridType(key, value, 'simple');
    }.property('model.gridType'),

    imageGrid: function (key, value) {
        return this.gridType(key, value, 'image');
    }.property('model.gridType'),

    detailedGrid: function (key, value) {
        return this.gridType(key, value, 'detailed');
    }.property('model.gridType'),

    gridType: function (key, value, type) {
        // setter
        if (value !== undefined) {
            this.set('model.gridType', type);
            this.get('model').save();
        }

        // getter
        return this.get('model.gridType') === type;
    },

    actions: {
        abortCreation: function () {
            this.set('isCreating', false);
        },

        setCreating: function (value) {
            this.set('isCreating', value);
        },

        createGridViewCell: function () {
            var name = this.get('newNameGridViewCell').trim();

            if (!name) {
                return;
            }

            var gridViewCell = this.store.createRecord('gridViewCell', {
                name: name.replace(/ /g, ''),
                title: name
            });

            gridViewCell.set('parentGridView', this.get('model'));

            this.set('newNameGridViewCell', 'newGridCell');
            this.set('isCreating', false);

            gridViewCell.save();

            this.set('isCreating', true);
        }
    }

});
