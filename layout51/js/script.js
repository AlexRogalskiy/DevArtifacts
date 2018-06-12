/*
This time try to code js in a different way than I use to... more ordered and following this practices 
https://rmurphey.com/blog/2009/10/15/using-objects-to-organize-your-code

Please let me know what u think :D 

Thanks for watching!

Also original dribbble
https://dribbble.com/shots/2705517-boldybae
*/

var mySlider = {
  
  config : {
    
    slider : '.slider-content',
    activeSlide : '.slide.active',
    button: '.next-button',
    transition: 500,
    delay: function() {return this.transition;},
    navigation : '.control-nav'
    
  },
  
  init : function(config) {
        //$.extend(mySlider.config, config);
        this.createNav();
        $(mySlider.config.button).
            click(function() {
                mySlider.animateSlide($(this));
            });
    },
  
  getActiveSlide : function() {
    
    return $(mySlider.config.activeSlide);   
       
  },
  
  getNextSlide : function() {
     
     var nextSlide = mySlider.getActiveSlide().next();
      
     if ( nextSlide.length === 0 ){
      
       nextSlide = $(mySlider.config.slider).find('.slide').eq(0);   
     } 
    
    return nextSlide;
    
  },
  
  getNextSlideColorAndName : function() {
    
    var colorAndName = {};
    var nextSlidenext = mySlider.getNextSlide().next();
    var nextSlideColor = nextSlidenext.data('color');
    var nextSlideName = nextSlidenext.data('name');
    
    colorAndName.color = nextSlideColor;
    colorAndName.name = nextSlideName;
    
    if ( nextSlidenext.length === 0 ) {
      nextSlidenext = $(mySlider.config.slider).find('.slide').eq(0);  
      nextSlideColor = nextSlidenext.data('color');
      nextSlideName = nextSlidenext.data('name');
      
      colorAndName.color = nextSlideColor;
      colorAndName.name = nextSlideName;
    }
    
    return colorAndName;
  }, 
  
  createNav : function() {
    
    var totalSlides = $(mySlider.config.slider).find('.slide').length;
    var controlNav = $(mySlider.config.navigation).find('ul');
    var nav;
                        
    for( var i=0; i < totalSlides; i++ ){
        
        var active = "";
        if(i === 0){
          active = 'active';
        }
        
        controlNav.append('<li class="slider-nav nav-'+i+' '+active+' "></li>')

    }                      
                        
  },
  
  animateNav : function() {
    
    var activeNav  = $('li.active');
    var nextNav = activeNav.next();
    
    if(nextNav.length === 0){
      nextNav = $('.control-nav li').eq(0);
    }
    
    activeNav.removeClass('active');
    nextNav.addClass('active');
  },
  
  animateSlide : function(button) {
    
    var activeSlide  = mySlider.getActiveSlide();
    var nextSlide = mySlider.getNextSlide();
    var delay = mySlider.config.delay(); 
    var clipPath = $('.clip-svg');
    
    clipPath.css('transition-duration', mySlider.config.transition+'ms');
    button.css('pointer-events', 'none');
    nextSlide.css('z-index',10);
    button.css('background', mySlider.getNextSlideColorAndName().color);
    button.prev().find('.color').html(mySlider.getNextSlideColorAndName().name);
    nextSlide.addClass('active').css('opacity', 1); 
    
    setTimeout(function() {
      activeSlide.removeClass('active').css('opacity', 0);
    }, delay);
    
    setTimeout(function() {
      nextSlide.css('z-index','');
      button.css('pointer-events', 'auto');
    }, delay + 300);
    
    mySlider.animateNav();
    
  }
  
} 


$(document).ready(function() { mySlider.init(); });

