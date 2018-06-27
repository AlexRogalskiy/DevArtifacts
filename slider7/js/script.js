/* 
* Hi and Welcome to Codepen!
*
* My name is Ignacio and I am looking for a Dribble invitation.
* Please contact me via twitter if you have 1, 
* I would like to have 1 hehe :)
* 
*
* Finally I can reproduce in CSS what I managed to design in Photoshop. 
* Still not all browsers allow for the creatives to reproduce everything.
* We still have browser compatibility problems.
*
* I will keep publishing examples to help push the web foward.
* PLEASE Like, Heart or Share if you like, and don't forget to follow. 
* Thanks.
*
* Now let's animate it :)
*/

$(document).ready(function(){
  
	var event = $('.event')
     ,tl = new TimelineLite({onUpdate:updateSlider,onComplete:restart})
	   ,wid = $(window).width()
     ,PowVal = ''
  	 ,PowOut = 'Back'+PowVal+'.easeOut'
  	 ,PowIn = 'Back'+PowVal+'.easeIn'
  	 ,PowInOut = 'Back'+PowVal+'.easeInOut'
  	 ,playButton = $('.play')
  	 ,stopButton = $('.stop')
     ,eventContent = $('.content-wrapper')
     ,thumb = $('.thumb')
     ,contentItems = $('.top h3,.top h4, .details > div')
  	 ,tags = $('.tags')
     ,pricesLabels = $('.section .label')
     ,pricesPrices = $('.section .price')
  	 ,bottomLink = $('.bottom a')
     ,speed = 0.8;
    
  	tl.set(event, {left:wid})
      .set(thumb,{backgroundSize:'320px 320px'})
      .set(tags, {left:200,autoAlpha:0})
      .set(bottomLink, {right:200,autoAlpha:0})
      .set(contentItems, {left:200,autoAlpha:0})
      .set(pricesLabels,{scale:0})
      .set(pricesPrices,{scale:0})
      .to(event, speed,{left:0,ease:PowOut},1,'intro')
      .staggerTo(contentItems, speed,{left:0,autoAlpha:1,ease:Elastic.easeInOut},0.2,'-=0.6') 
      .to(tags, speed,{left:30,autoAlpha:1,ease:Elastic.easeInOut},'-=0.6')
   		.staggerTo(pricesLabels, speed,{scale:1,ease:Elastic.easeInOut},0.2,'-=0.6') 
      .staggerTo(pricesPrices, speed,{scale:1,ease:Elastic.easeInOut},0.2,'-=1')
      .to(bottomLink, speed,{right:0,autoAlpha:1,ease:Elastic.easeInOut},'-=0.6')
      .to(event, speed,{left:-wid,ease:PowIn},8);
		tl.play();
  	
  $("#slider").slider({
    range: false,  min: 0,  max: 100,  step:.1,  
    slide: function ( event, ui ) { 
      tl.pause();    tl.progress( ui.value/100 );
    }});	
  
  function updateSlider() {
    $("#slider").slider("value", tl.progress() *100);   
  } 			  

  $(playButton).click(function(){
    tl.stop();
    tl.restart();
  })
    $(stopButton).click(function(){
    tl.stop();
  })
  function restart(){
    tl.stop();
    tl.restart();
  }
});