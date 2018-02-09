var timeline = new TimelineMax({
    repeat: -1,
    yoyo: true
  }),
  feTurb = document.querySelector('#feturbulence');

timeline.add(
  TweenMax.to(feTurb, 8, {
    onUpdate: function() {
      var bfX = this.progress() * 0.005 + 0.015, //base frequency x
        bfY = this.progress() * 0.05 + 0.1, //base frequency y
        bfStr = bfX.toString() + ' ' + bfY.toString(); //base frequency string
      feTurb.setAttribute('baseFrequency', bfStr);
    }
  }), 0
);