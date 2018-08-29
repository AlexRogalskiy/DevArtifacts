App.SmartwatchView = Ember.View.extend({
  tagName: 'div',
  attributeBindings: ['style'],
  classNames: ['smartwatch-view'],
  classNameBindings: ['platform', 'smartwatchModel'],
  templateName: 'views/smartwatch_view',

  platform: function () {
    return this.get('controller.controllers.editor.smartwatch.platform');
  }.property('controller.controllers.editor.smartwatch'),

  smartwatchModel: function() {
    return this.get('controller.controllers.editor.smartwatch.name');
  }.property('controller.controllers.editor.smartwatch'),

  zoomLevelStyle: function() {
    var zoomLevel = this.get('context.zoomLevel');
    return 'transform: scale(' + zoomLevel + ', '  + zoomLevel + ');' +
      '-webkit-transform: scale(' + zoomLevel + ', '  + zoomLevel + ');';
  }.property('context.zoomLevel'),

  style: function() {
    return this.get('zoomLevelStyle');
  }.property('zoomLevelStyle')

});
