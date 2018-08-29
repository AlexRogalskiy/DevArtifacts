App.MenuTabView = Ember.View.extend({
  tagName: 'div',
  classNames: ['tab-menu'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/menu_tab_view'

});
