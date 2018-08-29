App.WatchClickListenable = Ember.Mixin.create({
    navigationTarget: function(key, value) {

        // setter
        if (arguments.length > 1) {

            // Delete
            if (value === null) {
                var watchClickListener = this.get('watchClickListener');
                if (watchClickListener !== null) {
                    //var watchNavigation = watchClickListener.get('watchNavigation');
                    //watchNavigation.deleteRecord();
                    watchClickListener.deleteRecord();
                    watchClickListener.save();
                    this.set('watchClickListener', null);
                    this.get('model').save();
                }
            // Set WatchClickListener
            } else {
                var watchClickListener = this.get('watchClickListener');

                // Create new WatchClickListener
                if (watchClickListener === null) {
                    watchClickListener = this.store.createRecord('watchClickListener');

                    var watchNavigation = this.store.createRecord('watchNavigation', {
                        destination: value
                    });
                    watchNavigation.save();

                    watchClickListener.set('watchNavigation', watchNavigation);
                    watchClickListener.save();

                    var button = this.get('model');
                    button.set('watchClickListener', watchClickListener);
                    button.save();
                // Update existing WatchClickListener
                } else {
                    var watchNavigation = watchClickListener.get('watchNavigation');

                    if (watchNavigation === null) {
                        watchNavigation = this.store.createRecord('watchNavigation', {
                            destination: value
                        });
                        watchClickListener.set('watchNavigation', watchNavigation);
                    }

                    watchNavigation.set('destination', value);
                    watchNavigation.save();
                    watchClickListener.save();
                }
            }

        }

        // getter
        return this.get('watchClickListener.watchNavigation.destination');
    }.property(
        'model',
        'model.watchClickListener',
        'model.watchClickListener.watchNavigation.destination')
});
