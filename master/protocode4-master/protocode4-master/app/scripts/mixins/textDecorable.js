App.TextDecorable = Ember.Mixin.create({
  textNormal: function(key, value) {
    return this.textDecoration(key, value, 'none');
  }.property('model.textDecoration'),

  textBold: function(key, value) {
    return this.textDecoration(key, value, 'bold');
  }.property('model.textDecoration'),

  textItalic: function(key, value) {
    return this.textDecoration(key, value, 'italic');
  }.property('model.textDecoration'),

  textDecoration: function(key, value, decoration) {
    // setter
    if (value !== undefined) {
      this.set('model.textDecoration', decoration);
      this.get('model').save();
    }

    // getter
    return this.get('model.textDecoration') === decoration;
  }
  
});
