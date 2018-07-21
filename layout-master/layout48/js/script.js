/*
You can check out original dribble shot here https://dribbble.com/shots/2172302-Poign-e-de-main-virile-New-website

& Website here

http://www.poigneedemainvirile.com/

*/


const next = $('li.next');
const prev = $('li.prev');
const svgMask = $('#slider-mask');
const loading = $('.line');
const totalSlides = $('.slide').length;
var counter = 1;

var fn = debounce(function() {

	initSlider();

}, 250);



function initSlider() {
  
  var titles = $('.slide h1');
  var currectTitleHeight = titles.height();
  var slideHeight = $('.slide').height();
  var slideWidth = $('.slide').width();
  var currentTitle = $('.slide.active h1');
  var currentTitleWidth = currentTitle.width();
  var nextTitle = $('.slide.next h1');
  var nextTitleWidth = nextTitle.width();
  var prevTitle = $('.slide.prev h1');
  var prevTitleWidth = prevTitle.width();
  var nextNextSlide = $('.slide.next').next();
  var nextnextTitle = nextNextSlide.find('h1');
  var activeSlide = $('.slide.active');
  var mask = $('.mask');
  var activeSlideImage = $('.slide.active .slide-image');
  var header = $('.header-wrapper');
  var footer = $('.footer-wrapper');
  var loadingWrapper = $('.loading-screen');
  var loadingLine = $('.line');
  
  
  TweenMax.set( titles, { y: (slideHeight/2) - (currectTitleHeight/2), autoAlpha:0 } );
  TweenMax.set( currentTitle, { x: (slideWidth/2) - (currentTitleWidth/2)} );
  TweenMax.set( nextTitle, { x: (0 - nextTitleWidth ) + 80 } );
  TweenMax.set( prevTitle, { x: (slideWidth - 80) } );
  TweenMax.set( nextnextTitle, { x: -(slideWidth + (slideWidth/2)) } );
  TweenMax.set( activeSlideImage, { x:0, scale:1.3 } );
  
  TweenMax.to( loadingLine, 1, {width:'100%', background:'#e8c19d'} );
  
  setTimeout(function() {
    TweenMax.to( loadingWrapper, 0.5, {css: {top: -(slideHeight/2), height:slideHeight, background:'#e8c19d'}} );
    TweenMax.to( mask, 0.5, { autoAlpha:1, delay:0.5 } )
    TweenMax.set( loadingLine, {width:'0%'} );
    TweenMax.to( header, 0.5,{ autoAlpha:1, delay:0.8 } );
    TweenMax.to( activeSlideImage, 0.7,{ autoAlpha:1, scale:1, delay:1.2 } );
    TweenMax.to( loadingWrapper, 0.5, {autoAlpha:0, delay:1.2} );
    TweenMax.to( currentTitle, 0.5, { autoAlpha:1, delay:1.8} );
    TweenMax.to( nextTitle, 0.5, { autoAlpha:0.5, delay:1.8 } );
    TweenMax.to( prevTitle, 0.5,{ autoAlpha:0.5, delay:1.8} );
    TweenMax.to( footer, 0.5, { autoAlpha:1, delay:2.5 } );
  // 
  },1000)
 
  
}





function moveTitles( current, next, prev, bool) {
  
  var slideWidth = $('.slide').width();
  var currentTitle = current.find('h1');
  var currentTitleWidth = currentTitle.width();
  var nextTitle = next.find('h1');
  var nextTitleWidth = nextTitle.width();
  var prevTitle = prev.find('h1');
  var prevTitleWidth = prevTitle.width();
  var nextNextSlide = next.next();
  var prevPrevSlide = prev.prev();
  
  if(nextNextSlide.length === 0 ) {
    nextNextSlide = $('.slide').eq(0);
  }
  
  if(prevPrevSlide.length === 0 ) {
    prevPrevSlide = $('.slide').eq(totalSlides - 1);
  }
  
  var nextnextTitle = nextNextSlide.find('h1');
  var nextnextTitleWidth = nextnextTitle.width();
  var prevprevTitle = prevPrevSlide.find('h1');
  var prevprevTitleWidth = prevprevTitle.width();
  
  if(bool) {
    
    TweenMax.set( nextnextTitle, { x: (0 - nextnextTitleWidth ) - (slideWidth/2), autoAlpha:0 } );
    
    setTimeout(function() {
      TweenMax.to( currentTitle,0.3,{ x: (slideWidth - 80), autoAlpha:0.5 } );
      TweenMax.to( nextTitle, 0.3,{ x: (slideWidth/2) - (nextTitleWidth/2), autoAlpha:1 } );
      TweenMax.to( prevTitle, 0.3, {x: slideWidth + (slideWidth/2), autoAlpha:0 } );
      TweenMax.to( nextnextTitle, 0.3,{x:  (0 - nextnextTitleWidth ) + 80, autoAlpha:0.5 } );
      
    },300);

    setTimeout(function() {
       TweenMax.set( prevTitle, { x: -(slideWidth + (slideWidth/2)), autoAlpha:0 } );
    },800);
    
  }else {
    
    TweenMax.set( nextnextTitle, { x: (slideWidth) + (slideWidth/2), autoAlpha:0 } );
    
    setTimeout(function() {
      TweenMax.to( currentTitle,0.3,{x:  (0 - currentTitleWidth ) + 80, autoAlpha:0.5 } );
      TweenMax.to( prevTitle, 0.3,{ x: (slideWidth/2) - (nextTitleWidth/2), autoAlpha:1 } );
      TweenMax.to( nextTitle, 0.3, { x: -(slideWidth + (slideWidth/2)), autoAlpha:0 } );
      TweenMax.to( prevprevTitle, 0.3,{ x: (slideWidth - 80), autoAlpha:0.5 } );
      
    },300)
    

    setTimeout(function() {
       TweenMax.set( nextTitle, { x: (slideWidth + (slideWidth/2)), autoAlpha:0 } );
    },800)
    
  }
}

function moveNext() {
  
   var activeSlide = $('.slide.active');
   var nextSlide = activeSlide.next();
   var prevSlide = activeSlide.prev();
   var nextNextSlide = nextSlide.next();
  var loadingLine = $('.line');
  
  
  
  if( prevSlide.length === 0 ) {
    
    prevSlide = $('.slide').eq(totalSlides - 1);
  }
  
  if(nextNextSlide.length === 0 ) {
    
    nextNextSlide = $('.slide').eq(0);
    
  }
   
   if( nextSlide.length !== 0 ){ 
     
     counter = counter + 1;
     slideAnim(activeSlide, nextSlide, prevSlide);
     changeCategory(activeSlide, nextSlide);
     moveSlidesNumbers(counter, true);
    } else {
      
      counter = 1;
      nextSlide = $('.slide').eq(0);
      nextNextSlide = $('.slide').eq(1);
      slideAnim(activeSlide, nextSlide, prevSlide);
      changeCategory(activeSlide, nextSlide);
      moveSlidesNumbers(counter, true);
    }
  
     setTimeout(function() {
       activeSlide.removeClass('active').removeClass('next').addClass('prev');
       nextSlide.removeClass('next').removeClass('prev').addClass('active'); 
       prevSlide.removeClass('prev');
       nextNextSlide.addClass('next');
       
     },200);
  
  
     moveTitles(activeSlide, nextSlide, prevSlide, true);
}

function movePrev() {
  
   var activeSlide = $('.slide.active');
   var nextSlide = activeSlide.next();
   var prevSlide = activeSlide.prev();
   var prevPrevSlide =  prevSlide.prev();
  
  if( nextSlide.length === 0 ) {
    
    nextSlide = $('.slide').eq(0);
  }
  
   if(prevPrevSlide.length === 0 ) {
    
      prevPrevSlide = $('.slide').eq(totalSlides - 1);
    
    }
  
   if( prevSlide.length !== 0 ){ 
     
     counter = counter - 1;
     slideAnim(activeSlide, prevSlide);
     moveSlidesNumbers(counter, false);
     
    } else {
      counter = $('.slide').length;
      prevSlide = $('.slide').eq(counter - 1)
      prevPrevSlide = $('.slide').eq(totalSlides - 2);
      slideAnim(activeSlide, prevSlide);
       moveSlidesNumbers(counter, false);
    }
  
    setTimeout(function() {
       activeSlide.removeClass('active').removeClass('next').addClass('next');
       prevSlide.removeClass('next').removeClass('prev').addClass('active'); 
       nextSlide.removeClass('next');
       prevPrevSlide.addClass('prev');
     },200);
  
    moveTitles(activeSlide, nextSlide, prevSlide, false);
}

function slideAnim( current, nextSlide, prevSlide ) {
  
  var nextprevSlideBgColor = nextSlide.data('color');
  var activeSlideTop = current.find('.slide-top .slide-image');
  var activeSlideBottom = current.find('.slide-bottom .slide-image');
  var nextprevSlideTop = nextSlide.find('.slide-top .slide-image');
  var nextprevSlideBottom = nextSlide.find('.slide-bottom .slide-image');
  var nextNextSlide = nextSlide.next();
  
  if(nextNextSlide.length === 0 ) {
    
    nextNextSlide = $('.slide').eq(0);
    
  }
  
  TweenMax.to(svgMask, 0.8, {fill:  nextprevSlideBgColor});
  TweenMax.to(activeSlideTop, 0.6, {autoAlpha: 0, x: '-3%', delay:0.5}); 
  TweenMax.to(activeSlideBottom, 0.6, {autoAlpha: 0, x: '3%', delay:0.5}); 
  TweenMax.to(nextprevSlideTop, 0.6, {autoAlpha: 1, x: '0%', delay:0.5}); 
  TweenMax.to(nextprevSlideBottom, 0.6, {autoAlpha: 1, x: '0%', delay:0.5});
  
  
}

function changeCategory(current, nextprev) {
  
  const categoryCurrent = $('.category.current');
  const categoryNext = $('.category.next');
  var currentCategory = current.data('category');
  var nextprevCategory = nextprev.data('category');
  
  TweenMax.to(categoryCurrent, 0.5, { y: '100%', delay:0.5});
  TweenMax.to(categoryNext, 0.5, { y: '0%', delay:0.5});
  
   categoryCurrent.html(categoryCurrent);
   categoryNext.html(nextprevCategory);
  
  setTimeout(function() {
    
    TweenMax.set(categoryCurrent, { y: '0%'});
    TweenMax.set(categoryNext, { y: '-100%'});
    
    categoryCurrent.html(nextprevCategory);
    
  }, 850);
  
}

function moveSlidesNumbers(slideNumber, boolean) {
  
  var numberCurrent = $('.number .current');
  var numberNext = $('.number .next');
  var numberPrev = $('.number .prev');
  var counter = $('.slide').length;
  
  TweenMax.to(numberCurrent, 0.5, { y: '-100%', delay:0.5});
  
  if (boolean) {
    TweenMax.to(numberNext, 0.5, { y: '0%', delay:0.5});
  
  }else {
    TweenMax.to(numberPrev, 0.5, { y: '0%', delay:0.5});
  }
  
  setTimeout(function() {
       
      TweenMax.set(numberCurrent, { y: '0%'});
      TweenMax.set(numberNext, { y: '100%'});
      TweenMax.set(numberPrev, { y: '100%'});
       
      numberCurrent.html(slideNumber);
    
         if( slideNumber === counter) {
           numberPrev.html(counter - 1);
           numberNext.html(1);
           
           
         } else if(slideNumber === 1) {
           numberPrev.html(counter);
           numberNext.html(slideNumber + 1);
           
         } else {
           numberPrev.html(slideNumber - 1);
           numberNext.html(slideNumber + 1);
         }
     },850);
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


window.addEventListener('resize', fn);


next.on('click', function(e){
  e.preventDefault();
  moveNext();
});

prev.on('click', function(e){
  e.preventDefault();
  movePrev();
});


initSlider();



