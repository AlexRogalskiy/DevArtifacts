var sky = $(document).width();

TweenMax.fromTo(['#clouds path:nth-child(2)','#clouds path:nth-child(1)'],20,{x:-500},{x:sky+50,repeat:-1,ease:Linear.easeInOut})

var blink = new TimelineMax({repeat:-1,repeatDelay:2})
blink.to('#eyes',.25,{scaleY:.25,transformOrigin:'50% 50%'})
.to('#eyes',.25,{scaleY:1,transformOrigin:'50% 50%'})

var tieFlap = new TweenMax.to("#tie path:nth-child(1)", .5, {
  morphSVG:"#tie path:nth-child(2)", 
  ease:Linear.easeOut,
  onComplete:function(){tieFlap.reverse()},
  onReverseComplete:function(){tieFlap.play()}
});

var hairFlap1 = new TweenMax.to("#foreHeadHair path:nth-child(1)", .5, {
  morphSVG:"#foreHeadHair path:nth-child(2)", 
  ease:Linear.easeOut,
  onComplete:function(){hairFlap1.reverse()},
  onReverseComplete:function(){hairFlap1.play()}
});

var hairFlap2 = new TweenMax.to("#neckHair path:nth-child(1)", .5, {
  morphSVG:"#neckHair path:nth-child(2)", 
  ease:Linear.easeOut,
  onComplete:function(){hairFlap2.reverse()},
  onReverseComplete:function(){hairFlap2.play()}
});

var rocket = new TweenMax.to("#flame", .2, {
  scale:1.1,
  transformOrigin:'0% 60%',
  ease:Power2.easeInOut,
  onComplete:function(){rocket.reverse()},
  onReverseComplete:function(){rocket.play()}
});

$(window).scroll(function(e){
		var scrollTop = $(window).scrollTop();
		var docHeight = $(document).height();
		var winHeight = $(window).height();
		var scrollPercent = (scrollTop) / (docHeight - winHeight);
		var scrollPercentRounded = Math.round(scrollPercent*5)/100;

		fly.progress( scrollPercent ).pause();
	});

	function timelineIsUpdating() {
		console.log('timelineIsUpdating()');
	}


var fly = new TweenMax.to('#guy',5, {scale:.5,bezier:{curviness:1, values:[{x:-100, y:-50},{x:-220, y:100},{x:-400, y:-10}]},paused:true, onUpdate:timelineIsUpdating})

