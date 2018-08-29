App.SmartphoneScreenView = Ember.View.extend({
  tagName: 'div',
  attributeBindings: ['style'],
  classNames: ['smartphone-screen-view'],
  templateName: 'views/smartphone_screen_view',

  style: function() {
    var style = "";
    style += 'background-color: ' + this.get('context.backgroundColor') + ";";
  	return style;
  }.property(
  	'context.backgroundColor'
  )

});
