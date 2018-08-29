App.UiWatchSliderView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-watch-slider', 'expanded'],
  classNameBindings: ['controller.controllers.editor.smartwatch.platform'],
  templateName: 'views/ui_watch_control_view_slider',

  attributeBindings: ['style'],

  style: function() {
    var isAndroidWear = this.get('controller.controllers.editor.smartwatch.platform') === 'androidwear';
    var parentWidth = this.get("parentView.context.computedWidth");
    var parentHeight = this.get("parentView.context.computedHeight");
    var style = "";

    if(!isAndroidWear) {
      style += 'width: ' + (parentWidth - 4) + "px;";
      style += 'height: ' + (parentHeight - 4) + "px;";
      style += 'margin: 2px 2px; ';
    }

    return style;
  }.property(
    'context.computedWidth',
    'context.computedHeight',
    'controller.controllers.editor.smartwatch.platform'
  )

});
