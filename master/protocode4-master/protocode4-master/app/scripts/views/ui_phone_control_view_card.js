App.UiCardView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-card', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_card'

});
