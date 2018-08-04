
var tm = new TimelineMax({onComplete:function(){tm.reverse();},onReverseComplete:function(){tm.play();}})
tm.to('#coin',.25,{y:120,ease:Power2.easeInOut,transformOrigin:'50% 50%',rotation:360},'+=.5')
.to("#unbend", .25, {morphSVG:"#bend",ease:Elastic.easeInOut},'-=.13')
.to('#slit',.25,{scaleX:0,ease:Power2.easeInOut,transformOrigin:'50% 50%'},'-=.25')
.to('#phone',.25,{y:10,ease:Bounce.easeInOut},'-=.13')
.to('#hole',.25,{scale:.95,transformOrigin:'50% 50%',ease:Bounce.easeInOut},'-=.25')
.to('#heart',.25,{scale:.9,transformOrigin:'50% 50%',ease:Bounce.easeInOut})
.to('#heart',.25,{scale:1,transformOrigin:'50% 50%',ease:Bounce.easeInOut})
.to('#heart',.25,{scale:.9,transformOrigin:'50% 50%',ease:Bounce.easeInOut})
.to('#heart',.25,{scale:1,transformOrigin:'50% 50%',ease:Bounce.easeInOut})

