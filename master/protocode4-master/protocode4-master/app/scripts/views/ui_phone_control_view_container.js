App.UiContainerView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-container', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_container',

  click: function(evt) {
      var idPrefix = evt.target.id;
      if(idPrefix.search('Container') !== -1) {
          this.get('controller').send('transitionToRoute', 'controlContainer', this.get('context'));
      }
  }

});
