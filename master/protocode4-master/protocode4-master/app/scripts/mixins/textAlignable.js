App.TextAlignable = Ember.Mixin.create({
  textAlignLeft: function(key, value) {
    return this.textAlign(key, value, 'left');
  }.property('model.textAlign'),

  textAlignCenter: function(key, value) {
    return this.textAlign(key, value, 'center');
  }.property('model.textAlign'),

  textAlignRight: function(key, value) {
    return this.textAlign(key, value, 'right');
  }.property('model.textAlign'),

  textAlign: function(key, value, alignment) {
    // setter
    if (value !== undefined) {
      this.set('model.textAlign', alignment);
      this.get('model').save();
    }

    // getter
    return this.get('model.textAlign') === alignment;
  }
  
});
