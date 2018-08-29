App.TabletScreenView = Ember.View.extend({
  tagName: 'div',
  classNames: ['tablet-screen-view'],
  classNameBindings: ['isRotated'],
  templateName: 'views/tablet_screen_view',

  isRotated: function() {
      if(this.get('context.isRotated')) {
          return 'rotated';
      } else {
          return '';
      }
  }.property('context.isRotated')

});
