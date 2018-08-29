App.UiAudioRecorderView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-audio-recorder-view', 'control-button', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_audio_recorder',
  attributeBindings: ['style'],

  style: function() {
    var isAndroid = this.get('controller.controllers.editor.device.platform') === 'android';
    var parentWidth = this.get("parentView.context.computedWidth");
    var parentHeight = this.get("parentView.context.computedHeight");

    var style = '';

    if(isAndroid) {
      style += 'width: ' + (parentWidth - 8) + "px;";
      style += 'height: ' + (parentHeight - 16) + "px;";
      style += 'margin: 8px 4px; ';
    }

    return style;
  }.property(
    'context.computedWidth',
    'context.computedHeight',
    'controller.controllers.editor.device.platform'
  )

});
