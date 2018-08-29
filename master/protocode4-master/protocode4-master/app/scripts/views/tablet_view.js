App.TabletView = Ember.View.extend({
  tagName: 'div',
  attributeBindings: ['style'],
  classNames: ['tablet-view'],
  classNameBindings: ['platform', 'tabletModel', 'isRotated'],
  templateName: 'views/tablet_view',

  platform: function () {
    return this.get('controller.controllers.editor.device.platform');
  }.property('controller.controllers.editor.device'),

  tabletModel: function() {
    return this.get('controller.controllers.editor.device.name');
  }.property('controller.controllers.editor.device'),

  isRotated: function() {
      if(this.get('context.isRotated')) {
          return 'rotated';
      } else {
          return '';
      }
  }.property('context.isRotated'),

  zoomLevelStyle: function() {
    var zoomLevel = this.get('context.zoomLevel');
    return 'transform: scale(' + zoomLevel + ', '  + zoomLevel + ');' +
      '-webkit-transform: scale(' + zoomLevel + ', '  + zoomLevel + ');';
  }.property('context.zoomLevel'),

  style: function() {
    return this.get('zoomLevelStyle');
  }.property('zoomLevelStyle')

});
