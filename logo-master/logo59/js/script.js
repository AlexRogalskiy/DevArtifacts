
$(function() {
  var isOverLogo = false;
  
  function pathLength() {
    return this.getTotalLength();
  }
  
  function onLoadAnimation() {
    logoAnimation();
    nameAnimation();
  }
  
  function mouseOverAnimation() {
    if (isOverLogo) { return; }
    isOverLogo = true;
    logoAnimation();
  }
  
  function mouseLeave() {
    setTimeout(function() {
      isOverLogo = false;
    }, 1000);
  }
  
  function logoAnimation(timeline) {
    $('.NavLogo-piece').each(function() {
      TweenLite.set(this, { fillOpacity: 0, strokeDasharray: this.getTotalLength(), strokeDashoffset: this.getTotalLength() });
      TweenLite.to(this, 0.5, { strokeDashoffset: 0 });
      TweenLite.to(this, 0.8, { fillOpacity: 1, delay: 0.5 });
    });
    
    $('.NavLogo-shadow').each(function() {
      TweenLite.fromTo(this, 0.5, { fillOpacity: 0 }, { fillOpacity: 1, delay: 0.8});
    });
  }
  
  function nameAnimation() {
    TweenLite.set('.NavLogo-name', { fillOpacity: 0, x: 100 });
    TweenLite.to('.NavLogo-name', 0.8, { x: 0, delay: 0.5 });
    TweenLite.to('.NavLogo-name', 0.8, { fillOpacity: 1, delay: 0.5 });
  }
  
  $('#Run').on('click', onLoadAnimation);
  $('#NavLogo-color, #NavLogo-mono').on('mouseenter', mouseOverAnimation);
  $('#NavLogo, #NavLogo-mono').on('mouseleave', mouseLeave);
  onLoadAnimation();
});