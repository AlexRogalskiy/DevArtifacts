/*
 templates/watch_controller.hbs
 */
App.WatchControllerController = Ember.ObjectController.extend({
    needs: ['editor'],
    isActive: false,
    zoomLevel: 1
});
