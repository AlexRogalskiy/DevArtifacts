App.UiWatchDroppable = Ember.Mixin.create({
  classNameBindings: ['draggingOver'],

  draggingOver: false,

  dragEnter: function(event) {
    this.set('draggingOver', true);
    return false;
  },

  dragLeave: function(event) {
    this.set('draggingOver', false);
  },

  dragOver: function(event) {
    this.set('draggingOver', true);
    event.preventDefault();
    return false;
  },

  drop: function(event) {
    event.preventDefault();
    this.get('controller').send('addUiWatchControl', event.dataTransfer.getData('uiWatchControlType'), this);
    this.set('draggingOver', false);

    // used to prevent multiple fires of drop in nested views
    return false;
  }
});
