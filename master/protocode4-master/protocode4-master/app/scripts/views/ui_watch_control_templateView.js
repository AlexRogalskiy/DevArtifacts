App.UiWatchControlTemplateView = Ember.View.extend({
  tagName: 'div',
  classNames: ['img-thumbnail', 'control-ui-watch-picker'],
  attributeBindings: ['draggable', 'title', 'style', 'dataPlacement:data-placement', 'dataToggle:data-toggle'],
  draggable: "true",

  title: function () {
    return this.get('context.label');
  }.property('context.label'),

  style: function() {
    return 'background-image: url("' + this.get('context.imageSource') + '");cursor:pointer;';
  }.property('context.imageSource'),

  dataPlacement: 'bottom',
  dataToggle: 'tooltip',


  dragStart: function(event) {
    event.dataTransfer.setData('uiWatchControlType', this.get('context.type'));
  },

  didInsertElement: function(event) {
  }

});
