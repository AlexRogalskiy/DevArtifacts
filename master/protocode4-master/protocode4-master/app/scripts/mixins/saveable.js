App.Saveable = Ember.Mixin.create({
    actions: {
        acceptChanges: function() {
            this.get('model').save();
        }
    }
});
