App.UiImageViewView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-image-view', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_image_view'
});