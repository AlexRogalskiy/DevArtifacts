App.UiWatchLabelView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-watch-label', 'expanded'],
  classNameBindings: ['controller.controllers.editor.smartwatch.platform', 'context.textAlign'],
  templateName: 'views/ui_watch_control_view_label'

});
