
//
//  SVG Remake of Nick Buturishvili's "Switch" dribbble shot.
//  Check out Nick's dribbble profile as he has some really cool shots
//
//  Original: dribbble.com/shots/2272690-Switch
//
//  Be sure to also check out the CSS only version developed by the talented
//  Nikolay Talanov -> codepen.io/suez/pen/WQjwOb/
//  
//  Kudos to Nick for the shot and Nikolay for building the CSS only version!
//
//
//  I hope some of you like it and maybe even use it in some of your projects :)!


var bgRect = $('#bgRect');
var botArrow = $('#arrow__lower');
var topArrow = $('#arrow__upper');
var arrowG = $('#arrow_g');
var circle = $('#transCircle');

var x1 = $('#x1');
var x2 = $('#x2');
var x3 = $('#x3');
var x4 = $('#x4');

var x_g = $('#arrow_x_g');


var tl = new TimelineMax({paused:true});

  tl.to(bgRect,0.55,{x:-492,ease:Linear.easeNone},'start');
  tl.to(arrowG,0.2,{scale:1.1,transformOrigin:"center",ease:Back.easeIn},'start');
  tl.to([arrowG,circle],0.2,{x:90,delay:0.35,ease:Sine.easeOut},'start');
  tl.to(arrowG,0.2,{scale:0.15,delay:0.26},'start');
  tl.to(arrowG,0.2,{opacity:0,delay:0.32},'start');
  tl.to(circle,0.2,{opacity:1,delay:0.32},'start');

  tl.to(x_g,0,{opacity:1,delay:0.5},'start');
  tl.to(circle,0,{opacity:0,delay:0.55},'start');

  tl.to([x1,x2],0.15,{'stroke-dashoffset':0,ease:Elastic.easeOut.config(0.25, 3),delay:0.55},'start');
  tl.to([x3,x4],0.15,{'stroke-dashoffset':0,ease:Elastic.easeOut.config(0.25, 3),delay:0.6},'start');

  tl.to([x1,x2],0.15,{strokeWidth:5.5,delay:0.62,ease:Power3.easeOut},'start');
  tl.to([x3,x4],0.15,{strokeWidth:5.5,delay:0.62,ease:Power3.easeOut},'start');

//tl.to([botArrow,topArrow],0.1,{'stroke-width':25});


//tl.to(circle,0,{opacity:0});


//tl.to([x1,x2],0.4,{'stroke-width':5.5});
//tl.to([x3,x4],0.4,{'stroke-width':5.5});

TweenMax.to($('#text'),1,{x:100});

$('#c').click(function(){
  var cb = $(this);
  if($(cb).is(":checked")){
    tl.play();
  } else {
    tl.reverse();
  }
});