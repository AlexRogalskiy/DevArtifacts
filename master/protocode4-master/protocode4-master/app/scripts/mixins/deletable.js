App.Deletable = Ember.Mixin.create({
  actions: {
    delete: function() {
      this.get('model').deleteRecord();
      this.get('model').save();
      this.transitionToRoute('viewController');
    }
  }
});