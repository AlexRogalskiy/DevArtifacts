
  var RAY_QUANT = 50;
  var RADIUS = 140;
  var RADIUS_VARIENT = .5;
  var ROTATE_SPEED = 70000;
  var RAY_SPEED = 100;
  var FILL_COLOR = 'rgba(232, 79, 62, .65)';
  var STROKE_COLOR = 'rgba(232, 79, 62, .65)';
  var STROKE_WIDTH = 3;
  var RAY_EASE = mina.bounce;
  var RAY_FREEQUENCY = .05;

  /**
   * Animates the vector rays visually
   *
   * @class RaysView
   * @param {jQuery} $element A reference to the containing DOM element.
   * @constructor
   **/
  function RaysView($element) {
      /**
       * A reference to the containing DOM element.
       *
       * @default null
       * @property $element
       * @type {jQuery}
       * @public
       */
      this.$element = $element;

      this.init();
  }

  var proto = RaysView.prototype;

  /**
   * Initializes the UI Component View.
   * Runs a single setupHandlers call, followed by createChildren and layout.
   * Exits early if it is already initialized.
   *
   * @method init
   * @returns {RaysView}
   * @private
   */
  proto.init = function() {
      this.layout();
      this.paper = new Snap('#js-rays');
      this.totalGroup = this.paper.group();
      this.createRays();

      return this;
  };

  /**
   * Performs measurements and applys any positioning style logic.
   * Should be run anytime the parent layout changes.
   *
   * @method layout
   * @returns {RaysView}
   * @public
   */
  proto.layout = function() {
      this.centerX = this.$element.width() / 2;
      this.centerY = this.$element.width() / 2;
      this.lineX1 = 0;
      this.lineY1 = 0;
      this.lineX2 = 0;
      this.lineY2 = 0;

      return this;
  };

  //////////////////////////////////////////////////////////////////////////////////
  // HELPER METHODS
  //////////////////////////////////////////////////////////////////////////////////

  /**
   * creates each of the rays
   *
   * @method createRays
   * @public
   */
  proto.createRays = function() {
      var i = 0;
      var l = RAY_QUANT;

      for (; i < l; i++) {
          this.update(i);
      }

      this.animateGroup();
  };

  /**
   * update coordinates for line placement
   *
   * @method update
   * @public
   */
  proto.update = function(i) {
      var varient = RADIUS * RADIUS_VARIENT;
      var minHeight = RADIUS - varient;
      var r = Math.random() * (RADIUS - minHeight) + minHeight;
      var x = this.centerX + r * Math.cos(2 * Math.PI * i / RAY_QUANT);
      var y = this.centerX + r * Math.sin(2 * Math.PI * i / RAY_QUANT);

      var lineCoords = {
          lineX2: x,
          lineY2: y,
          endpointX: this.centerX + RADIUS * Math.cos(2 * Math.PI * i / RAY_QUANT),
          endpointY: this.centerY + RADIUS * Math.sin(2 * Math.PI * i / RAY_QUANT)
      }

      this.draw(lineCoords);
  };

  /**
   * draw the circle
   *
   * @method draw
   * @public
   */
  proto.draw = function(lineCoords) {
      var line = this.paper.line(this.centerX, this.centerY, lineCoords.lineX2, lineCoords.lineY2);
      var circ = this.paper.circle(lineCoords.lineX2, lineCoords.lineY2, 5);
      var rayGroup = this.paper.group(line, circ).attr({
          'fill': FILL_COLOR,
          'stroke': STROKE_COLOR,
          'stroke-width': STROKE_WIDTH
      });

      rayGroup.lineCoords = lineCoords;
      this.animateRay(rayGroup);
      this.totalGroup.add(rayGroup);
  };

  /**
   * Animate a vector group
   *
   * @method animateRay
   * @public
   */
  proto.animateRay = function(group) {
      var raySpeed = Math.random() * (ROTATE_SPEED * RAY_FREEQUENCY);
      var line = group[0];
      var circ = group[1];
      var self = this;

      setTimeout(function() {
          if (group.reverse) {
              line.animate({
                  x1: self.centerX,
                  y1: self.centerX,
                  x2: group.lineCoords.lineX2,
                  y2: group.lineCoords.lineY2
              }, RAY_SPEED, mina.bounce, self.animateRay.bind(self, group));

              circ.animate({
                  cx: group.lineCoords.lineX2,
                  cy: group.lineCoords.lineY2,
              }, RAY_SPEED, RAY_EASE);

              group.reverse = false;
          } else {
              line.animate({
                  x1: self.centerX,
                  y1: self.centerX,
                  x2: group.lineCoords.endpointX,
                  y2: group.lineCoords.endpointY
              }, RAY_SPEED, RAY_EASE, self.animateRay.bind(self, group));

              circ.animate({
                  cx: group.lineCoords.endpointX,
                  cy: group.lineCoords.endpointY,
              }, RAY_SPEED, RAY_EASE);

              group.reverse = true;
          }
      }, raySpeed);
  };

  /**
   * Animate the entire group
   *
   * @method animateGroup
   * @public
   */
  proto.animateGroup = function() {
      this.resetGroup();
      var totalGroupAnim = this.totalGroup.animate({
          transform: 'rotate(360, ' + this.centerX + ',' + this.centerY + ')'
      }, ROTATE_SPEED, mina.linear, this.animateGroup.bind(this));
  };

  /**
   * reset the group transform
   *
   * @method resetGroup
   * @public
   */
  proto.resetGroup = function() {
      var t = new Snap.Matrix()
      t.rotate(0, 300, 300)
      this.totalGroup.transform(t);
  };

var raysView = new RaysView($('#js-rays'));