App.UiButtonView = Ember.View.extend({
  tagName: 'div',
  classNames: ['control-button', 'expanded'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  templateName: 'views/ui_phone_control_view_button',

  attributeBindings: ['style'],


  mouseDown: function() {
    var clickColor = this.get('context.clickColor');
    var hasClickColor = clickColor !== '';
    if(hasClickColor) {
      this.$().css("backgroundColor", clickColor);
    }

  },

  mouseUp: function() {
    var isAndroid = this.get('controller.controllers.editor.device.platform') === 'android';
    var backColor = this.get('context.backgroundColor');
    var hasBackColor = backColor !== '';
    if(hasBackColor) {
      this.$().css("backgroundColor", backColor);
    } else {
      if(isAndroid) {
        this.$().css("backgroundColor", "#cecece");
      } else {
        this.$().css("backgroundColor", "");
      }
    }
  },

  style: function () {
    var isAndroid = this.get('controller.controllers.editor.device.platform') === 'android';
    var backColor = this.get('context.backgroundColor');
    var clickColor = this.get('context.clickColor');
    var hasBackColor = backColor !== '';
    var hasClickColor = clickColor !== '';
    var isButtonDefault = (!hasBackColor && !hasClickColor);
    var parentWidth = this.get("parentView.context.computedWidth");
    var parentHeight = this.get("parentView.context.computedHeight");

    var style = "";
  	style += 'color: ' + this.get('context.textColor') + "; ";
  	style += 'border-radius: ' + this.get('context.borderRadius') + "px;";

    if(isAndroid && isButtonDefault) {
      style += 'width: ' + (parentWidth - 8) + "px;";
      style += 'height: ' + (parentHeight - 16) + "px;";
      style += 'margin: 8px 4px; ';
    }

    if(hasBackColor) {
      style += 'background-color: ' + this.get('context.backgroundColor') + "; ";
    }

  	return style;
  }.property(
    'context.textColor',
    'context.borderRadius',
    'context.computedWidth',
    'context.computedHeight',
  	'context.backgroundColor',
    'context.clickColor',
    'controller.controllers.editor.device.platform'
  )

});
