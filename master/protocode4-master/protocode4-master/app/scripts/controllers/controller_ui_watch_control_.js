/*
 templates/control_watch_XXX/index.hbs
 */
App.UiWatchControlController = Ember.ObjectController.extend(App.Saveable, {

    alignTop: function (key, value, previousValue) {
        // setter
        if (arguments.length > 1) {
            return this.handleConstraint(key, value, previousValue);
        }

        // getter
        return this.handleConstraint(key);
    }.property('model.alignTop'),

    alignBottom: function (key, value, previousValue) {
        // setter
        if (arguments.length > 1) {
            return this.handleConstraint(key, value, previousValue);
        }

        // getter
        return this.handleConstraint(key);
    }.property('model.alignBottom'),

    alignStart: function (key, value, previousValue) {
        // setter
        if (arguments.length > 1) {
            return this.handleConstraint(key, value, previousValue);
        }

        // getter
        return this.handleConstraint(key);
    }.property('model.alignStart'),

    alignEnd: function (key, value, previousValue) {
        // setter
        if (arguments.length > 1) {
            return this.handleConstraint(key, value, previousValue);
        }

        // getter
        return this.handleConstraint(key);
    }.property('model.alignEnd'),


    above: function (key, value, previousValue) {
        // setter
        if (arguments.length > 1) {
            return this.handleConstraint(key, value, previousValue);
        }

        // getter
        return this.handleConstraint(key);
    }.property('model.above'),

    below: function (key, value, previousValue) {
        // setter
        if (arguments.length > 1) {
            return this.handleConstraint(key, value, previousValue);
        }

        // getter
        return this.handleConstraint(key);
    }.property('model.below'),

    toStartOf: function (key, value, previousValue) {
        // setter
        if (arguments.length > 1) {
            return this.handleConstraint(key, value, previousValue);
        }

        // getter
        return this.handleConstraint(key);
    }.property('model.toStartOf'),

    toEndOf: function (key, value, previousValue) {
        // setter
        if (arguments.length > 1) {
            return this.handleConstraint(key, value, previousValue);
        }

        // getter
        return this.handleConstraint(key);
    }.property('model.toEndOf'),


    handleConstraint: function (key, value, previousValue) {
        var model = this.get('model');

        // setter
        if (arguments.length > 1) {
            if (this.isGoodConstraint(model, key, value)) {
                model.set(key, value);
                model.save();
            } else {
                alert('Found circularity in constraints. Please restore previous value.');
            }
        }

        // getter
        return model.get(key);
    },

    isGoodConstraint: function (model, key, value) {
        if (value === null) {
            return true;
        }

        var uiPhoneControls = [];
        var uiPhoneControlsToCheck = model.getRelatedUiWatchControls().concat(value).uniq();

        while (!($(uiPhoneControls).not(uiPhoneControlsToCheck).length === 0 && $(uiPhoneControlsToCheck).not(uiPhoneControls).length === 0) && !uiPhoneControlsToCheck.contains(model)) {
            uiPhoneControls = uiPhoneControlsToCheck;

            uiPhoneControlsToCheck = uiPhoneControlsToCheck.reduce(function (results, uiPhoneControl) {
                return results.concat(uiPhoneControl.getRelatedUiWatchControls());
            }, []).uniq();

        }

        return !uiPhoneControlsToCheck.contains(model);
    },

    actions: {
        deleteUiWatchControl: function () {
            var controlToDelete = this.get('model');

            var watchController = this.get('watchController');
            watchController.get('uiWatchControls').then(function (uiWatchControls) {
                uiWatchControls.removeObject(controlToDelete);
                watchController.save();
                //Reset the order attribute
                uiWatchControls.forEach(function (uiWatchControl, index) {
                    uiWatchControl.set('order', index + 1);
                    uiWatchControl.save();
                });
            });

            controlToDelete.deleteRecord();
            controlToDelete.save();

            this.transitionToRoute('watchController');
        }
    }

});
