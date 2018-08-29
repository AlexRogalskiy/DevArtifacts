/*
 templates/control_list_view_cell/index.hbs
 */
App.ControlListViewCellIndexController = Ember.ObjectController.extend(App.Saveable, App.Deletable, {
    actions: {
        delete: function () {
            var cellToDelete = this.get('model');
            var parentView = cellToDelete.get('parentListView');

            parentView.get('listViewCells').removeObject(cellToDelete);
            parentView.save();

            this._super();
        }
    }

});
