App.ControlAudioRecorderIndexRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        this._super(controller, model);

        controller.set('audioPlayers', this.store.findQuery('audioPlayer', {viewController: model.get('viewController.id')}));
    }
});
