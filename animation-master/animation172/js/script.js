console.clear();

var resize = {
  resize: function() {
      var el = document.querySelector('.container');
      resize.width = el.offsetWidth;
      resize.height = el.offsetHeight;
  }
};
window.addEventListener('resize', resize.resize);
resize.resize();

var vm = new Vue({
  el: 'svg',
  data: {
    ease: Expo.easeOut,
    easeValue: 'Expo',
    acceleration: 'easeOut',
    duration: 0.4,
    easeForce: 1,
    gap: 0.02,
    size: 60,
    p1: {x: 245, y: 245},
    p2: {x: 400, y: 360},
    p3: {x: 245, y: 500},
    p4: {x: 100, y: 360},
    square: true
  },
  
  ready: function() {
    this.reset();
    
    this.gui = new dat.GUI();
    /*var ease = this.gui.add(this, 'easeValue', ['Expo', 'Quad', 'Back', 'Cubic']);
    var acceleration = this.gui.add(this, 'acceleration', ['easeIn', 'easeOut', 'easeInOut']);
    this.gui.add(this, 'easeForce', 0, 5).step(0.1);*/
    this.gui.add(this, 'duration', 0.1, 5).step(0.1);
    this.gui.add(this, 'gap', 0.01, 0.1).step(0.01);
    var size = this.gui.add(this, 'size', 10, 200);
    
    size.onChange(this.reset.bind(this));
    /*ease.onChange(function() {
        this.ease = window[this.easeValue][this.acceleration];
    }.bind(this));
    acceleration.onChange(function() {
        this.ease = window[this.easeValue][this.acceleration];
      console.log(this.ease, window[this.easeValue][this.acceleration], this.acceleration);
    }.bind(this));*/
  },
  methods: {
    reset: function() {
        this.opened = {
          p1: {x: 10, y: 10},
          p2: {x: resize.width - 10, y: 10},
          p3: {x: resize.width - 10, y: resize.height - 10},
          p4: {x: 10, y: resize.height - 10}
        };
        this.closed = {
          p1: {x: resize.width / 2, y: resize.height / 2 - this.size},
          p2: {x: resize.width / 2 + this.size, y: resize.height / 2},
          p3: {x: resize.width / 2, y: resize.height / 2 + this.size},
          p4: {x: resize.width / 2 - this.size, y: resize.height / 2}
        };
      
      this.p1.x = this.closed.p1.x;
      this.p1.y = this.closed.p1.y;
      this.p2.x = this.closed.p2.x;
      this.p2.y = this.closed.p2.y;
      this.p3.x = this.closed.p3.x;
      this.p3.y = this.closed.p3.y;this.p4.x = this.closed.p4.x;
      this.p4.y = this.closed.p4.y;
      
      this.square = true;
    },
  },
  computed: {
    active: {
      $get: function() {
        return this.square;
      },
      $set: function(value) {
        this.square = value;
        var target = value ? this.opened : this.closed;
        
        TweenMax.to(this.p1, this.duration, {x: target.p1.x, y: target.p1.y, ease: this.ease, easeParams: this.easeForce});
        TweenMax.to(this.p2, this.duration, {x: target.p2.x, y: target.p2.y, ease: this.ease, easeParams: this.easeForce, delay: this.gap});
        TweenMax.to(this.p3, this.duration, {x: target.p3.x, y: target.p3.y, ease: this.ease, easeParams: this.easeForce, delay: this.gap * 2});
        TweenMax.to(this.p4, this.duration, {x: target.p4.x, y: target.p4.y, ease: this.ease, easeParams: this.easeForce, delay: this.gap * 3});    
      }
    }
  }
  
});