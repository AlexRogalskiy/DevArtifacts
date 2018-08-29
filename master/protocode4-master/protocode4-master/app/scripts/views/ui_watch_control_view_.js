App.UiWatchControlView = Ember.View.extend(App.UiWatchMoveable, {
  templateName: 'views/ui_watch_control_view_',
  classNames: ['ui-watch-control'],
  classNameBindings: ['active'],
  attributeBindings: ['style'],

  smartwatch: Ember.computed.alias('controller.controllers.editor.smartwatch'),

  uiWatchControlType: function () {
    var controlType = this.get('context').constructor.toString();
    console.log('Choose view for: ' + controlType);

    switch (controlType) {

      case ('App.WatchButton'):
        return App.UiWatchButtonView;
        break;

      case ('App.WatchLabel'):
        return App.UiWatchLabelView;
        break;

      case ('App.WatchSlider'):
        return App.UiWatchSliderView;
        break;

      case ('App.WatchSwitch'):
        return App.UiWatchSwitchView;
        break;

      case ('App.WatchVoiceMessage'):
        return App.UiWatchVoiceMessageView;
        break;

    }
  }.property(),

  alignParentTop: function() {
    return this.get('context.alignParentTop');
  }.property('context.alignParentTop'),

  alignParentBottom: function() {
    return this.get('context.alignParentBottom');
  }.property('context.alignParentBottom'),

  alignParentStart: function() {
    return this.get('context.alignParentStart');
  }.property('context.alignParentStart'),

  alignParentEnd: function() {
    return this.get('context.alignParentEnd');
  }.property('context.alignParentEnd'),

  top: function() {
    return this.computeVerticalAxis(this.get('context.top'));
  }.property('context.top', 'smartwatch'),

  bottom: function() {
    return this.computeVerticalAxis(this.get('context.bottom'));
  }.property('context.bottom', 'smartwatch'),

  start: function() {
    return this.computeHorizontalAxis(this.get('context.start'));
  }.property('context.start', 'smartwatch'),

  end: function() {
    return this.computeHorizontalAxis(this.get('context.end'));
  }.property('context.end', 'smartwatch'),

  /**** Margin ****/
  marginTop: function() {
    return this.computeVerticalAxis(this.get('context.marginTop'));
  }.property('context.marginTop', 'smartwatch'),

  marginBottom: function() {
    return this.computeVerticalAxis(this.get('context.marginBottom'));
  }.property('context.marginBottom', 'smartwatch'),

  marginStart: function() {
    return this.computeHorizontalAxis(this.get('context.marginStart'));
  }.property('context.marginStart', 'smartwatch'),

  marginEnd: function() {
    return this.computeHorizontalAxis(this.get('context.marginEnd'));
  }.property('context.marginEnd', 'smartwatch'),

  /**** Padding ****/
  paddingTop: function() {
    return this.computeVerticalAxis(this.get('context.paddingTop'));
  }.property('context.paddingTop', 'smartwatch'),

  paddingBottom: function() {
    return this.computeVerticalAxis(this.get('context.paddingBottom'));
  }.property('context.paddingBottom', 'smartwatch'),

  paddingStart: function() {
    return this.computeHorizontalAxis(this.get('context.paddingStart'));
  }.property('context.paddingStart', 'smartwatch'),

  paddingEnd: function() {
    return this.computeHorizontalAxis(this.get('context.paddingEnd'));
  }.property('context.paddingEnd', 'smartwatch'),

  computedWidth: function() {
    return this.computeHorizontalAxis(this.get('context.computedWidth'));
  }.property('context.computedWidth', 'smartwatch'),

  computedHeight: function() {
    return this.computeVerticalAxis(this.get('context.computedHeight'));
  }.property('context.computedHeight', 'smartwatch'),

  style: function() {
    var result = '';

    result += 'top: ' + this.get('top') + 'px; ';
    result += 'left: ' + this.get('start') + 'px; ';

    result += 'height: ' + this.get('computedHeight') + 'px;';
    result += 'width: ' + this.get('computedWidth') + 'px;';

    result += 'margin-top: ' + this.get('marginTop') + 'px;';
    result += 'margin-bottom: ' + this.get('marginBottom') + 'px;';
    result += 'margin-left: ' + this.get('marginStart') + 'px;';
    result += 'margin-right: ' + this.get('marginEnd') + 'px;';

    result += 'padding-top: ' + this.get('paddingTop') + 'px;';
    result += 'padding-bottom: ' + this.get('paddingBottom') + 'px;';
    result += 'padding-left: ' + this.get('paddingStart') + 'px;';
    result += 'padding-right: ' + this.get('paddingEnd') + 'px;';

    return result;
  }.property(
    'start',
    'top',
    'computedWidth',
    'computedHeight',
    'marginTop',
    'marginBottom',
    'marginStart',
    'marginEnd',
    'paddingTop',
    'paddingBottom',
    'paddingStart',
    'paddingEnd'
    ),

  computeVerticalAxis: function(value) {
    return value / this.get('smartwatch.screenHeight') * this.get('smartwatch.cssHeight');
  },

  computeHorizontalAxis: function(value) {
    return value / this.get('smartwatch.screenWidth') * this.get('smartwatch.cssWidth');
  }

});
