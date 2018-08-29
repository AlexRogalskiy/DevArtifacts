/*
 templates/control_audio_recorder/index.hbs
 */
App.ControlAudioRecorderIndexController = App.UiPhoneControlController.extend({

    audioPlayers: function() {
        if(this.get('model.viewController.uiPhoneControls')) {
            return this.get('model.viewController.uiPhoneControls').filter(function(control) {
                return control.constructor.toString() === 'App.AudioPlayer';
            });
        }
        return [];
    }.property('model.viewController.uiPhoneControls.[]'),

    allowedAudioPlayers: function () {
        return this.get('audioPlayers').filterBy('sourceType.type', 'hardwareFile');
    }.property('audioPlayers.@each.sourceType.type'),

    actions: {
        acceptChanges: function () {
            this._super();

            if (this.get('model.audioPlayer')) {
                this.get('model.audioPlayer').save();
            }
        }
    }

});
