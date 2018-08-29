/*
 templates/control_grid_view_cell/index.hbs
 */
App.ControlGridViewCellIndexController = Ember.ObjectController.extend(App.Saveable, App.Deletable, {
    actions: {
        delete: function () {
            var cellToDelete = this.get('model');
            var parentView = cellToDelete.get('parentGridView');

            parentView.get('gridViewCells').removeObject(cellToDelete);
            parentView.save();

            this._super();
        }
    }

});
