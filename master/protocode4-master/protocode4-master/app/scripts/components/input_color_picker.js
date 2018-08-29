App.InputColorPickerComponent = Ember.Component.extend({

    actions: {
        acceptChanges: function () {
            this.sendAction();
        }
    },

    didInsertElement: function () {
        this.$('.colorpicker').colorpicker({
            format: 'hex'
        });
    }

});
