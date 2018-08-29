App.ControlVideocameraControllerIndexRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        this._super(controller, model);

        controller.set('videoViews', this.store.findQuery('videoView', {viewController: model.get('viewController.id')}));
    }
});
