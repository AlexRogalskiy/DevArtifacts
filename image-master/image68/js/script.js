var bounce = new TimelineLite({onComplete:function(){bounce.reverse()},onReverseComplete:function(){bounce.play()}})
bounce.to("#bend", .15, {morphSVG:"#unbend", ease:Linear.easeInOut})
.to('#dog',1,{rotation:-15,transformOrigin:'50% 50%',physicsProps:{y:{velocity:-780, angle:90, friction:0.11, acceleration:1.5}}},'-=.15').to(['#backLegs path','#frontLegs path'],.5,{y:-3,rotation:20},'-=1')
bounce.timeScale(1.5)

