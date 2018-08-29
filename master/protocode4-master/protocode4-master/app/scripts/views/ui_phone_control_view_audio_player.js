App.UiAudioPlayerView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-audio-player-view', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_audio_player'
});