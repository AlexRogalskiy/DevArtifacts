App.FocusInputComponent = Ember.TextField.extend({
    becomeFocused: function () {
        this.$().select();
    }.on('didInsertElement')
});
