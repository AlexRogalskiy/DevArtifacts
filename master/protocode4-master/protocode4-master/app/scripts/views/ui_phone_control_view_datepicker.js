App.UiDatepickerView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-datepicker', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_datepicker'

});
