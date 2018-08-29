App.UiDroppable = Ember.Mixin.create({
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
    var receiver;
    if(this.get('context').constructor.toString() === 'App.SceneController') {
        receiver = this.get('context.viewControllerToShow');
    } else if(this.get('context').constructor.toString() === 'App.Container') {
        receiver = this.get('context.childViewController');
    } else {
        receiver = this.get('context.viewControllerToShow');
    }
    if(!receiver.get('isParent')) {
        this.get('controller').send('addUiPhoneControl', receiver, event.dataTransfer.getData('uiPhoneControlType'));
    }
    this.set('draggingOver', false);

    // used to prevent multiple fires of drop in nested views
    return false;
  }
});
