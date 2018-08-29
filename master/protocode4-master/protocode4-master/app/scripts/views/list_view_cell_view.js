App.ListViewCellView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-list-view-cell', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/list_view_cell_view',
  attributeBindings: ['style'],

  style: function() {
  	var style = "";

  	var backgroundColor = this.get("parentView.context.backgroundColor");

  	style += "background-color : "+backgroundColor+"; ";

  	return style;
  }.property(
    'parentView.context.backgroundColor'
  )

});
