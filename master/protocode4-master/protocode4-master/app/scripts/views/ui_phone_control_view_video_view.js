App.UiVideoViewView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-video-view', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_video_view'
});