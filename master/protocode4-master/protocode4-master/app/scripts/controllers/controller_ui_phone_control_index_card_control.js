/*
 templates/control_card/index.hbs
 */
App.ControlCardIndexController = App.UiPhoneControlController.extend({

    oneAction: function (key, value) {
        return this.numActions(key, value, 1);
    }.property('model.numActions'),

    twoActions: function (key, value) {
        return this.numActions(key, value, 2);
    }.property('model.numActions'),

    threeActions: function (key, value) {
        return this.numActions(key, value, 3);
    }.property('model.numActions'),

    numActions: function (key, value, type) {
        // setter
        if (value !== undefined) {
            this.set('model.numActions', type);
            this.get('model').save();
        }

        // getter
        return this.get('model.numActions') === type;
    }

});
