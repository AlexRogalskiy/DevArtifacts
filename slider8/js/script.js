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

var  tl = new TimelineLite({onUpdate:updateSlider,onComplete:restart})
    ,animSpeed = 1
    ,level0 = '.bgimage0'
    ,level1 = '.bgglass1'
    ,level2 = '.bgglass2'
    ,level3 = '.bgblury1'
		,level1Start = [-200,0,0,0,-40,100,-240,100]
    ,level1end   = [100,0,120,0,80,100,60,100]
		,level2Start = [120,0,140,0,100,100,80,100]
    ,level2end   = [-40,0,-20,0,-60,100,-80,100]
		,level3Start = [100,0,120,0,80,100,60,100]
    ,level3end   = [40,0,60,0,20,100,0,100]
    ,$slideContainer = $('.slides-container')
    ,$slides = $('.slide')
  	,playButton = $('.play')
  	,stopButton = $('.stop')
    ,$resetStyle = $('.bgglass1,.bgglass2,.bgblury1');

	 //First Reset
   tl.set($resetStyle, {autoAlpha:0})
     //.set($slides.first().find(level1),{webkitClipPath:level1Start})
     //.set($slides.first().find(level2),{webkitClipPath:level2Start})
     //.set($slides.first().find(level3),{webkitClipPath:level3Start})
   		//Then Animate
  	  .to($slides.first().find(level0), animSpeed, {autoAlpha:1})
  	  .to($slides.first().find(level1), animSpeed, {autoAlpha:1},'fadeInGlass')
   		.to($slides.first().find(level2), animSpeed, {autoAlpha:1},'fadeInGlass')
      .to($slides.first().find(level3), animSpeed, {autoAlpha:1},'fadeInGlass')
      .to(level1Start,40, level1end,'fadeInGlass')
   		.to(level2Start,40, level2end,'fadeInGlass')
      .to(level3Start,40, level3end,'fadeInGlass')
     	.to($slides.first().find(level1), animSpeed*3, {autoAlpha:0},"-=9",'fadeOutGlass')
   		.to($slides.first().find(level2), animSpeed*3, {autoAlpha:0},"-=9",'fadeOutGlass')
      .to($slides.first().find(level3), animSpeed*3, {autoAlpha:0},"-=9",'fadeOutGlass');
			//.to($slides.first().find(level3), animSpeed, {autoAlpha:1});
        
  tl.play();

level1end.onUpdate = function() {
  TweenMax.set($slides.first().find(level1), {webkitClipPath:'polygon('+level1Start[0]+'%'+level1Start[1]+'%,'+level1Start[2]+'%'+level1Start[3]+'%,'+level1Start[4]+'%'+level1Start[5]+'%,'+level1Start[6]+'%'+level1Start[7]+'%)'});
};
level2end.onUpdate = function() {
  TweenMax.set($slides.first().find(level2), {webkitClipPath:'polygon('+level2Start[0]+'%'+level2Start[1]+'%,'+level2Start[2]+'%'+level2Start[3]+'%,'+level2Start[4]+'%'+level2Start[5]+'%,'+level2Start[6]+'%'+level2Start[7]+'%)'});
};
level3end.onUpdate = function() {
  TweenMax.set($slides.first().find(level3), {webkitClipPath:'polygon('+level3Start[0]+'%'+level3Start[1]+'%,'+level3Start[2]+'%'+level3Start[3]+'%,'+level3Start[4]+'%'+level3Start[5]+'%,'+level3Start[6]+'%'+level3Start[7]+'%)'});
};
  
function updateSlider(){}
function restart(){
    tl.stop();
    tl.restart();
}

	
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