/*
 templates/editor.hbs
 */
App.EditorRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        this._super(controller, model);
        controller.set('model', model.application);
        var devices = [].addObjects(model.smartphones).addObjects(model.tablets);
        controller.set('devices', devices);
        /*controller.set('smartphones', model.smartphones);
        controller.set('tablets', model.tablets);*/
        controller.set('smartwatches', model.smartwatches);
        controller.set('smartphoneModel', model.smartphones.findBy('id', this.get('smartphoneId')));
        controller.set('tabletModel', model.tablets.findBy('id', this.get('tabletId')));
        controller.set('smartwatchModel', model.smartwatches.findBy('id', this.get('smartwatchId')));
        controller.addObserver('target.location.lastSetURL', function() {
            var path = this.get('target.location.lastSetURL');
            var splittedPath = path.split('/');
            if(splittedPath[2] === 'watchControllers') {
                this.set('deviceContext', true);
            } else {
                this.set('deviceContext', false);
            }
        });
    },

    model: function () {
        return Ember.RSVP.hash({
            application: this.store.find('application').then(function (dataArray) {
                return dataArray.objectAt(0);
            }),
            smartphones: this.store.find('smartphone'),
            tablets: this.store.find('tablet'),
            smartwatches: this.store.find('smartwatch'),
        });
    }
});
