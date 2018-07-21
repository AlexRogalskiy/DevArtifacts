var s = Snap("#svg");

function draw( ev, x, y ) {
	var c1 = s.circle().attr({ 
		cx: x-6, 
		cy: y-6, 
		r: 3,
		fill: "none", 
		stroke: "gold", 
		strokeWidth: 2 });

	c1.animate ({r: 140, opacity: 0, strokeWidth: 0.5, stroke: "purple"}, 2500, mina.easeout, function(){
		c1.remove();
	});
}

s.mousemove( draw );

