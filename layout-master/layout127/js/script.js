var img1 = '.vlak._0 .content';
var img2 = '.vlak._1 .content';

$('.text').on('click', function(e){
  e.preventDefault();
  $('body').trigger('cbAnimStart');
});

$('body').on( 'cbAnimStart', function(event) {
  var easingIn = 'Circ.easeIn';
  var duration = 2.2;
  var delay = 0;
  var d_offset = 0.2;
  var o = {};
  
  $('.vlak .content').each( function(index){
    var $this = $(this);

    if ($this.hasClass('in-left')) {
      o = {x:-3600};
    } 
    else if ($this.hasClass('in-right')) { 
      o = {x:1555};
    }
    else if ($this.hasClass('in-bottom')) {
      o = {z:-1555};
    }
    else if ($this.hasClass('in-top')) {
      o = {z:1554};
    }
    else if ($this.hasClass('in-front')) {
      o = {y:1850};
      delay = index === 0 ? d_offset : 0;
    }
    else if ($this.hasClass('in-back')) {
      o = {y:-2500};
    }
    else { 
      o = {x:-3600};
    }
    
    TweenLite.from( $this, duration, { css: o, ease: easingIn, delay: delay, 
      onStart: function(){
        TweenLite.set( $this.find('img'), { opacity: 1 });
      },
      onComplete: function(){
        TweenLite.killTweensOf(this.target);
        var d = index === 0 ? 0 : 0.3;
        TweenMax.to( $this.find('img'), 2.6, { css: {z:+"20"}, ease:'Sine.easeInOut', delay: d , repeat:-1, yoyo:true });
      }
    });
    
    delay += d_offset;
  });
  
  setTimeout( function(){ 
    $('body').trigger('cbAnimStop');
  }, 9000);
  // Left
/*  TweenLite.from( $(img1 + '.in-left'), duration, { css: {x:-3600}, ease: easingIn, delay: 0.1, onStart: function(){
      TweenLite.set( $(img1).find('img'), { opacity: 1 });
  } });
  TweenLite.from( $(img2 + '.in-left'), duration, { css: {x:-3600}, ease: easingIn, delay: 0.2, onStart: function(){
      TweenLite.set( $(img2).find('img'), { opacity: 1 });
  } });*/
  //TweenLite.from( $(img1 + '.in-left'), duration, { css: {x:-3600}, ease: easingIn, delay: 0.1 });
  //TweenLite.from( $(img2 + '.in-left'), duration, { css: {x:-3600}, ease: easingIn, delay: 0.2 });
  
  // Right
/*  TweenLite.from( $(img1 + '.in-right'), duration, { css: {x:1555}, ease: easingIn, delay: 0.1 });
  TweenLite.from( $(img2 + '.in-right'), duration, { css: {x:1555}, ease: easingIn, delay: 0.2 });*/
  
  // Bottom
/*  TweenLite.from( $(img1 + '.in-bottom'), duration, { css: {z:-1555}, ease: easingIn, delay: 0.1 });
  TweenLite.from( $(img2 + '.in-bottom'), duration, { css: {z:-1555}, ease: easingIn, delay: 0.2 });*/
  
  // Top
/*  TweenLite.from( $(img1 + '.in-top'), duration, { css: {z:1555}, ease: easingIn, delay: 0.1 });
  TweenLite.from( $(img2 + '.in-top'), duration, { css: {z:1555}, ease: easingIn, delay: 0.2 });*/
  
  // Front
/*  TweenLite.from( $(img1 + '.in-front'), duration, { css: {y:1850}, ease: easingIn, delay: 0.1 });
  TweenLite.from( $(img2 + '.in-front'), duration, { css: {y:1850}, ease: easingIn, delay: 0.2 });*/
  
  // Back
/*  TweenLite.from( $(img1 + '.in-back'), duration, { css: {y:-2500}, ease: easingIn, delay: 0.2 });
  TweenLite.from( $(img2 + '.in-back'), duration, { css: {y:-2500}, ease: easingIn, delay: 0.1 });*/

});

$('body').on( 'cbAnimStop', function(event) {
  var duration = 1.2;
  var easingOut = 'Circ.easeInOut';
  var delay = 0;
  var d_offset = 0.2;
  var o = {};
  
  $('.vlak .content').each( function(index){
    var $this = $(this);

    if ($this.hasClass('out-left')) {
      o = {x:-3750};
    } 
    else if ($this.hasClass('out-right')) { 
      o = {x:3750};
    }
    else if ($this.hasClass('out-bottom')) {
      o = {z:-6800};
    }
    else if ($this.hasClass('out-top')) {
      o = {z:3750};
    }
    else if ($this.hasClass('out-front')) {
      o = {y:2750};
      delay = index === 0 ? d_offset : 0;
    }
    else if ($this.hasClass('out-back')) {
      o = {y:-6500};
    }
    else { 
      o = {x:-3750};
    }
    
    TweenLite.to( $this, duration, { css: o, ease: easingOut, delay: delay,
      onStart: function(){
        TweenMax.killTweensOf( $this.find('img') );
      },
      onComplete: function(){
        TweenMax.killTweensOf(this.target);
      }
    });
    
    delay += d_offset;
  });
    // Left
/*    TweenLite.to( $(img1 + '.out-left'), duration, { css: {x:-3750}, ease: easingOut, delay: 0.1 });
    TweenLite.to( $(img2 + '.out-left'), duration, { css: {x:-3750}, ease: easingOut, delay: 0.2 });
  
    // Right
    TweenLite.to( $(img1 + '.out-right'), duration, { css: {x:3750}, ease: easingOut, delay: 0.1 });
    TweenLite.to( $(img2 + '.out-right'), duration, { css: {x:3750}, ease: easingOut, delay: 0.2 });
  
    // Bottom
    TweenLite.to( $(img1 + '.out-bottom'), duration, { css: {z:-6800}, ease:easingOut, delay: 0.1 });
    TweenLite.to( $(img2 + '.out-bottom'), duration, { css: {z:-6800}, ease:easingOut, delay: 0.2 });
  
    // Top
    TweenLite.to( $(img1 + '.out-top'), duration, { css: {z:3750}, ease: easingOut, delay: 0.1 });
    TweenLite.to( $(img2 + '.out-top'), duration, { css: {z:3750}, ease: easingOut, delay: 0.2 });
  
    // Forward
    TweenLite.to( $(img1 + '.out-front'), duration, { css: {y:2750}, ease: easingOut, delay: 0.1 });
    TweenLite.to( $(img2 + '.out-front'), duration, { css: {y:2750}, ease: easingOut, delay: 0.2 });
  
    // Back
    TweenLite.to( $(img1 + '.out-back'), duration, { css: {y:-6500}, ease: easingOut, delay: 0.1 });
    TweenLite.to( $(img2 + '.out-back'), duration, { css: {y:-6500}, ease: easingOut, delay: 0.2 });*/
});


