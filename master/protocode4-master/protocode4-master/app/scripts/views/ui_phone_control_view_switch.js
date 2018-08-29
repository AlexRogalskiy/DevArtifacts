App.UiSwitchView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-switch', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_switch'

});
