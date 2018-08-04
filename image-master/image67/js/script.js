TweenMax.set('#blueBot',{x:-1000})

function robots(){
var tm = new TimelineMax({repeat:-1,repeatDelay:2})
.to('#redBot',2,{x:500,ease:Power3.easeInOut},'+=2')
.fromTo('#blueBot',2,{x:-1000},{x:0,ease:Power3.easeInOut},'-=1.5')
.to('body',2,{backgroundColor:'#FFDC6D'},'-=2')
.to('#blueBot',2,{x:480,onStart:newBot,ease:Power3.easeInOut},'+=2')

function newBot(){
  TweenMax.fromTo('#redBot',2,{x:-1000},{x:0,delay:.65,ease:Power3.easeInOut})
  TweenMax.to('body',2,{backgroundColor:'#ADBD90',delay:.65})
}

// /////////////////////////////////////////////////////////////

var sig = new TimelineMax({repeat:-1})
sig.fromTo('#redBotSignal', .5,{drawSVG:"0% 15%",ease:Linear.easeInOut},{drawSVG:"85% 100%",ease:Linear.easeInOut})
.fromTo('#redBotSignal', .5,{drawSVG:"85% 100%",ease:Linear.easeInOut},{drawSVG:"0% 15%",ease:Linear.easeInOut})

var bolt = new TweenMax.to(['#bolt','#leftEar','#rightEar','#nose'],.5,{opacity:.25,onComplete:function(){bolt.reverse()},onReverseComplete:function(){bolt.play()}})

var rhb = new TweenMax.to('#redHeart',.5,{scale:1.1,transformOrigin:'50% 50%',ease:Power2.easeInOut,onComplete:function(){rhb.reverse()},onReverseComplete:function(){rhb.play()}})

var sra= new TweenMax.to('#redRightArm',.5,{rotation:-3,ease:Linear.easeInOut,transformOrigin:'45% 25%',onComplete:function(){sra.reverse()},onReverseComplete:function(){sra.play()}})

var sla= new TweenMax.to('#redLeftArm',.5,{rotation:3,ease:Linear.easeInOut,transformOrigin:'25% 25%',onComplete:function(){sla.reverse()},onReverseComplete:function(){sla.play()}})

var redhead = new TweenMax.to('#redHead',1,{y:5,ease:Power2.easeInOut,onComplete:function(){redhead.reverse()},onReverseComplete:function(){redhead.play()}})

// ////////////////////////////////////////////////////

var lights1 = new TweenMax.staggerFromTo(['#light3','#light6'],.5,{fill:'#fff'},{fill:'#398080',repeat:-1},0.2)
var lights2 = new TweenMax.staggerFromTo(['#light2','#light5'],.5,{fill:'#398080'},{fill:'#E20717',repeat:-1},0.2)
var lights3 = new TweenMax.staggerFromTo(['#light1','#light4'],.5,{fill:'#E20717'},{fill:'#fffff',repeat:-1},0.2)
var eeg = new TweenMax.fromTo('#pulse',2,{drawSVG:"0%",ease:Linear.easeInOut},{drawSVG:"100%",ease:Linear.easeInOut,repeat:-1})
var static = new TweenMax.fromTo('#blueBotStatic',.75,{ease:Power1.easeInOut,opacity:0},{ease:Power1.easeInOut,opacity:1,repeat:-1})
var blueBotRArm= new TweenMax.to('#blueBotRightArm',.5,{rotation:-3,y:2,ease:Linear.easeInOut,transformOrigin:'65% 100%',onComplete:function(){blueBotRArm.reverse()},onReverseComplete:function(){blueBotRArm.play()}})
var blueBotLArm= new TweenMax.to('#blueBotLeftArm',.5,{rotation:3,y:2,ease:Linear.easeInOut,transformOrigin:'100% 65%',onComplete:function(){blueBotLArm.reverse()},onReverseComplete:function(){blueBotLArm.play()}})
var dial = new TweenMax.to('#dial',.5,{rotation:30,ease:Linear.easeInOut,transformOrigin:'50% 100%',onComplete:function(){dial.reverse()},onReverseComplete:function(){dial.play()}})
var blueBotBody = new TweenMax.to('#blueBotBody',.5,{y:2,ease:Sine.easeInOut,onComplete:function(){blueBotBody.reverse()},onReverseComplete:function(){blueBotBody.play()}})
var blueBotHead = new TweenMax.to('#blueBotHead',.5,{y:-2,ease:Sine.easeInOut,onComplete:function(){blueBotHead.reverse()},onReverseComplete:function(){blueBotHead.play()}})
var mouthBars = new TweenMax.staggerFromTo('#mouthBars rect',.5,{fill:'#398080'},{fill:'#fffff',repeat:-1},0.2)
var eyes = new TweenMax.to('#blueBotEyes',.5,{scale:1.1,transformOrigin:'50% 50%',ease:Sine.easeInOut,onComplete:function(){eyes.reverse()},onReverseComplete:function(){eyes.play()}})
}