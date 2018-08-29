App.GridViewCellView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-grid-view-cell', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/grid_view_cell_view'

});
