App.InputOnOffComponent = Ember.Component.extend({

    didInsertElement: function () {
        var self = this;
        this.$(".input-on-off").bootstrapSwitch({size: 'mini'});
        this.$(".input-on-off").on('switchChange.bootstrapSwitch', function (event, state) {
            self.set('controller.checked', state);
        });
    }

});
