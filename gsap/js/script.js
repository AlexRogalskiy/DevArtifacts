document.addEventListener('DOMContentLoaded', function() {

	// Hoisting
	var svgElement        = $(".dashboard"),
		timeline         = new TimelineMax(),
	    	body             = svgElement.find('.body'),
		main             = svgElement.find(".main"),
		header           = svgElement.find(".header"),
		headerBackground = header.find(".background"),
		headerBoxes      = header.find(".box-right, .box-left"),
		headerText       = header.find(".heading, .title"),
		menu             = svgElement.find(".menu"),
		menuBackground   = menu.find(".background"),
		menuElements     = menu.find(":not(.background)"),
		dataBlocks       = svgElement.find(".data-block"),
		charts           = svgElement.find(".chart"),
		donutCharts      = svgElement.find(".donut-chart *"),
		lineGraphLines   = svgElement.find(".line-graph .line"),
		lineGraphDots    = svgElement.find(".line-graph .dot"),
		lineGraphAreas   = svgElement.find(".line-graph .area");

	// Set initial state
	timeline.set([main, charts], { transformOrigin: '100% 100%' })
		.set([menuBackground, body], { transformOrigin: '0% 0%'})
		.set(headerBackground, { transformOrigin: '100% 100%'})
		.set([headerBoxes, dataBlocks, donutCharts], { transformOrigin: '50% 50%'});

	// Animate element
	timeline.from([main, body], 0.3, { scaleY: '0%', ease: Back.easeOut.config(1.7) })
		.staggerFrom(dataBlocks, 0.3, { scale: '0%', y: 100, ease: Back.easeOut.config(1.7) }, 0.2)
		.staggerFrom(charts, 0.3, { scaleY: '0%', ease: Back.easeOut.config(1.7) }, 0.2)
		.from(lineGraphLines, 0.75, { drawSVG: 0, ease: Power1.easeOut })
		.from(lineGraphAreas, 0.75, { opacity: 0, ease: Back.easeOut.config(1.7) }, '-=1.5')
		.staggerFrom(lineGraphDots, 0.3, { scale: 0, ease: Back.easeOut.config(1.7) }, 0.1, '-=1')
		.staggerFrom(donutCharts, 0.5, { drawSVG: 0, ease: Power1.easeOut }, 0.2, '-=3.5')
		.from(menuBackground, 0.3, { scaleX: '0%', ease: Back.easeOut.config(1.7) }, '-=5')
		.staggerFrom(menuElements, 0.3, { scaleX: '0%', ease: Back.easeOut.config(1.7) }, 0.1, '-=3.25')
		.from(headerBackground, 0.5, { scaleX: '0%', ease: Power1.easeOut }, '-=4.5')
		.staggerFrom(headerBoxes, 0.3, { scale: '0%', ease: Back.easeOut.config(1.7) }, 0.1, '-=4.5')
		.staggerFrom(headerText, 0.4, { scaleX: '0%', ease: Back.easeOut.config(1.7) }, 0.2, '-=4');
	
	// Pause on first frame and wait for waypoint
	// timeline.pause();
	
	// Animate on waypoint 
	svgElementWaypoint = new Waypoint({
		element: svgElement,
		handler: function(direction) {
			if(direction == 'down') {
				timeline.play();	
			} else {
				timeline.reverse();
			}
    		},
		offset: '50%'
	});
	
	$(".restart").on('click', function(){
		timeline.seek(0).play();
	});
	
	$(".reverse").on('click', function(){
		timeline.reverse();
	});
});