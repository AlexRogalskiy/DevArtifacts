App.UiMoveable = Ember.Mixin.create({
  isMoving: false,
  classNameBindings: ['isMoving'],

  offsetMouseX: 0,
  offsetMouseY: 0,

  mouseDown: function(event) {
    event.preventDefault();
    this.set('isMoving', true);

    var elementOffset = $(this.get('element')).offset();
    this.set('offsetMouseX', (event.pageX - elementOffset.left));
    this.set('offsetMouseY', (event.pageY - elementOffset.top));

    var self = this;

    $('.view-controller-preview-view').on('mousemove', function(event) {
      var element = self.get('element');
      var parentOffset = $(self.get('parentView.element')).offset();
      var posX = (((event.pageX - parentOffset.left - self.get('offsetMouseX')) / self.get('controller.zoomLevel')) - self.get('context.marginStart')) * self.get('device.screenWidth') / self.get('device.cssWidth');
      var posY = (((event.pageY - parentOffset.top - self.get('offsetMouseY')) / self.get('controller.zoomLevel')) - self.get('context.marginTop')) * self.get('device.screenHeight') / self.get('device.cssHeight');

      if(posY < 0) {
        posY = 0;
      }
      if(posX < 0) {
        posX = 0;
      }
      if((posX + self.get('context.outerWidth')) > self.get('context.viewController.width')) {
          posX = self.get('context.viewController.width') - self.get('context.outerWidth');
      }
      if((posY + self.get('context.outerHeight')) > self.get('context.viewController.height')) {
          posY = self.get('context.viewController.height') - self.get('context.outerHeight');
      }

      self.set('context.posX', posX);
      self.set('context.posY', posY);
    });

    return false;
  },

  mouseUp: function(event) {
    event.preventDefault();
    this.set('isMoving', false);
    this.get('context').save();
    $('.view-controller-preview-view').off('mousemove');
  }
});
