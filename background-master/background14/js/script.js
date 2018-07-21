document.addEventListener('DOMContentLoaded', function() {

	// Hoisting
	var svgElement  = $(".polygon-background-svg"),
		timeline      = new TimelineMax(),
		polygons     = svgElement.find("polygon");
  
  // Randomize polygons
  polygons.sort(function(){return 0.5-Math.random()});

	// Animate element
	timeline.staggerFrom(polygons, 1, { scale: 0, transformOrigin: "50% 50%", ease: Back.easeOut.config(1.7) }, 0.01);
	
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