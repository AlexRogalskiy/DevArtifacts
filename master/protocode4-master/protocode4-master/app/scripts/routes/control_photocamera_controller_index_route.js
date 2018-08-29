App.ControlPhotocameraControllerIndexRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        this._super(controller, model);

        controller.set('imageViews', this.store.findQuery('imageView', {viewController: model.get('viewController.id')}));
    }
});
