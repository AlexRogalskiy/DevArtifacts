/*
You can check out original dribble shot here https://dribbble.com/shots/2375246-Fashion-Butique-slider-animation

Comments or suggestions are always appreciate it. 
*/



var mySlider = {
  
  config: {
    
    slider : '.slider-content',
    activeSlide : '.slide.active',
    footerButtons: '.footer-wrapper .box',
    bgPicture: '.image-mask img',
    nav : '.control-nav',
    position : {
        x: 350,
        alpha:1,
    },
   nextPosition :{
        x: 150,
        alpha:1,
    },
   
  
  },
  
   init : function(config) {
     
     this.canvasInit();
     $(mySlider.config.footerButtons).
            click(function() {
                mySlider.changeButton($(this));
            });
    },
   
  canvasInit : function() {
    
    var canvas = $('.canvas')[0];
    var ctx = canvas.getContext('2d');
    var w = $(mySlider.config.activeSlide).width();
    var h = $(mySlider.config.activeSlide).height();
    var img = document.createElement('IMG'); 
    img.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/42764/mask-karlie.jpg";
    var position = {
        x: 150,
        alpha:1,
    }
    
    if (window.matchMedia("(min-width: 860px)").matches) {
        position = {
            x: 200,
            alpha:1,
        }
    }
    
    if (window.matchMedia("(min-width: 1200px)").matches) {
        position = {
            x: 250,
            alpha:1,
        }
    }
    
    canvas.width = w;
    canvas.height = h;
    mySlider.drawMask(canvas, ctx, position, img);
    
  },
  
  drawMask : function(canvas, ctx, position,img) {
    
    var w = $(mySlider.config.activeSlide).width();
    var h = $(mySlider.config.activeSlide).height();
    var cy = 50;
    var mStroke = 25; 
    var mWidth = 180;
    var mHeight = 300;
    
    if (window.matchMedia("(min-width: 860px)").matches) {
      mStroke = 35; 
      cy = 80;
      mWidth = 260;
      mHeight = 380;
    }
    
    if (window.matchMedia("(min-width: 1200px)").matches) {
      
      mStroke = 40; 
      cy = 120;
      mWidth = 360;
      mHeight = 460;
    }

    ctx.globalAlpha=position.alpha;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(position.x,cy,mWidth,mStroke);
    ctx.clip();
    ctx.drawImage(img,0,0, w, h);
    ctx.restore();
    
    ctx.save();
    ctx.rect(position.x, cy, mStroke, mHeight);
    ctx.clip();
    ctx.drawImage(img,0,0, w, h);
    ctx.restore();
    
    ctx.save();
    ctx.rect( position.x +mWidth, cy, mStroke, mHeight);
    ctx.clip();
     ctx.drawImage(img,0,0, w, h);
    ctx.restore();
    
    ctx.save();
    ctx.rect(position.x, cy + (mHeight-mStroke), mWidth, mStroke);
    ctx.clip();
    ctx.drawImage(img,0,0, w, h);
    ctx.restore();
    
  },
  
  changeSlide : function(id) {
   
   var activeSlide = $(mySlider.config.activeSlide);
   var newSlide = $(mySlider.config.slider).find('[data-order="'+id+'"]');
    
    this.animateSlide(activeSlide, newSlide);
    this.createMask(activeSlide, newSlide);
    
  },
  
  changeNav : function(id) {
    
    var activeNav = $(mySlider.config.nav).find('li');
    
    activeNav.removeClass('active');
    activeNav.eq(id-1).addClass('active');
    
  },
  
  changeButton : function(el) {
    
    var activeButton = $(mySlider.config.slider).find('.box.active');
    var target = el.data('id');
    
    if( !(el.hasClass('active')) ){
     
      activeButton.removeClass('active');
      el.addClass('active');
      this.changeSlide(target); 
      this.changeNav(target); 
    }
},
  
  createMask : function(active, newSlide) {
    
    var currentCanvas = active.find('.canvas')[0];
    var nextCanvas = newSlide.find('.canvas')[0];
    var position = mySlider.config.position;
    var positionNext =  mySlider.config.nextPosition;  
    
    var currentctx = currentCanvas.getContext('2d');
    var nextctx = nextCanvas.getContext('2d');
    
    var w = $(mySlider.config.activeSlide).width();
    var h = $(mySlider.config.activeSlide).height();
    
    var currentImg = document.createElement('IMG'); 
    var nextImg = document.createElement('IMG'); 
    var movex = 200;

    var position = {
        x: 350,
        alpha:1,
    }
   var nextPosition={
        x: 150,
        alpha:1,
    }
      
     TweenMax.set(positionNext, {x:"150"});
    
    if (window.matchMedia("(min-width: 860px)").matches) {
      
      position = {
         x: 400,
        alpha:1,
      };
      
      nextPosition = {
          x: 200,
          alpha:1,
      };
      
        movex = 200;
      
       TweenMax.set(positionNext, {x:"200"});
    }
    
    if (window.matchMedia("(min-width: 1200px)").matches) {
        position = {
         x: 450,
        alpha:1,
      };
      
      nextPosition = {
          x: 250,
          alpha:1,
      };
      
       movex = 200; 
       TweenMax.set(positionNext, {x:"250"});
    }
    
    currentImg.src = active.find('canvas').data('image');
    nextImg.src = newSlide.find('canvas').data('image');
    
    currentCanvas.width = nextCanvas.width = w;
    currentCanvas.height = nextCanvas.height = h;
     
    TweenMax.to(newSlide.find('.canvas'),0.3,{autoAlpha:1, delay:1.5});
    
    TweenMax.to(positionNext, 0.5, {x:"-="+movex+"", onUpdate: function() {
     
       mySlider.drawMask(currentCanvas, currentctx, positionNext, currentImg);

     },  onComplete: function() {
       
       TweenMax.to(active.find('.canvas'), 0.3, {autoAlpha:0}, "-=0.2");
       TweenMax.to(newSlide.find('.canvas'), 0.3, {autoAlpha:0}, "-=0.2");
     }});
    
    
    nextImg.onload = function() {
      mySlider.drawMask(nextCanvas, nextctx, positionNext, nextImg);
      
       TweenMax.to(position, 1, {x:"-="+movex+"", delay:1.3, onUpdate: function() {
     
           mySlider.drawMask(nextCanvas, nextctx, position, nextImg);

         }});
      
      console.log(position)
    }
    
  },
  
  animateSlide : function(active, newSlide) {
      
      var w = $(mySlider.config.slider).width();
      var backgroundImg = $(mySlider.config.bgPicture);
      var activeTitleBg = active.find('.title-background .mask-wrap');
      var activeMainTitle = active.find('.title-wrapper h1 .mask-wrap');
      var activeSlideContent = active.find('.slide-content'); 
      var activefakeBg = active.find('.fake-bg');
      var activeImageCaption = active.find('.image-caption');

      var newTitleBg = newSlide.find('.title-background .mask-wrap');
      var newTitle = newSlide.find('.title-wrapper h1 .mask-wrap');
      var newBgPicture = newSlide.data('img');
      var newfakeBg = newSlide.find('.fake-bg');
      var nextImageCaption = newSlide.find('.image-caption');
      var img = $('<img />')
      
      newSlide.addClass('next');
      
      activeMainTitle.addClass('mask-up')
      activeTitleBg.addClass('mask-down')
      activeImageCaption.addClass('mask-up');
      newTitle.addClass('mask-down');
      newTitleBg.addClass('mask-up');
      nextImageCaption.addClass('mask-down');
      
      
      TweenMax.set(activeSlideContent, {width:w});
      TweenMax.set(activefakeBg, {width:w});
      TweenMax.set(newfakeBg, {autoAlpha:0});
      
      TweenMax.to(active, 0.8, {width:'0%', ease: Power4.easeIn});
      TweenMax.to(activefakeBg, 0.3, {autoAlpha: 0, delay:0.4});
      TweenMax.to(backgroundImg, 0.3, {autoAlpha: 0, delay:0.4});
    
      setTimeout(function() {
        backgroundImg.remove();
        img.attr('src', newBgPicture).css('opacity',0);
        
        $('.image-mask').append(img);
        
      },600)
    
      TweenMax.to(newfakeBg, 0.5, {autoAlpha: 1, delay:1});
      TweenMax.to(img, 0.5, {autoAlpha: 1, delay:1});
      
      setTimeout(function() {
        newTitle.removeClass('mask-down');
        newTitleBg.removeClass('mask-up');
        
      },800);
      
    
      
      setTimeout(function() {
         active.removeClass('active');
         newSlide.addClass('active').removeClass('next');
         TweenMax.set(active, {width:'100%'});
         activeMainTitle.removeClass('mask-up');
         activeTitleBg.removeClass('mask-down');
        activeImageCaption.removeClass('mask-up');
        nextImageCaption.removeClass('mask-down');

      },1500)
  }
  
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};




$(document).ready(function() { 

mySlider.init(); 

var fn = debounce(function() {

   mySlider.init()

}, 250);

$(window).on('resize', fn);

});
