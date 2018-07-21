// Math ref: http://www.ryanjuckett.com/programming/analytic-two-bone-ik-in-2d/

!function() {

	"use strict";

	function Segment () {

		this.x = 0;
		this.y = 0;
		this.len = 0;
		this.len2 = 0;

	}

	Segment.prototype = {

		set length (len) {
			this.len = len;
			this.len2 = len * len;
		}

	}

	function line (x0, y0, x1, y1, color, width, d0, d1) {

		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = width;
		ctx.setLineDash([d0,d1]);
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
		ctx.moveTo(x0, y0);
		ctx.arc(x0, y0, width * 1.4, 0, 2 * Math.PI);
		ctx.moveTo(x1, y1);
		ctx.arc(x1, y1, width * 1.4, 0, 2 * Math.PI);
		ctx.fill();

	}
	function inverse_kinematic () {

		var f,angle, theta1, theta2, targetDistance1, targetDistance2, targetSqrDist1, targetSqrDist2;

		pointer.x = drawTarget.x;
		pointer.y= drawTarget.y;
		
		
		// target position 1
		var ix1 = pointer.x - origin1.x;
		var iy1 = pointer.y - origin1.y;

		// target square distances
		targetSqrDist1 = ix1 * ix1 + iy1 * iy1;
		targetDistance1 = Math.sqrt(targetSqrDist1);
		if ( targetDistance1 > segment1.len + segment2.len)
		{
			 f =  (segment1.len + segment2.len) / targetDistance1;
			 ix1 *= f;
			 iy1 *= f;
			 targetSqrDist1 = ix1 * ix1 + iy1 * iy1;
			 targetDistance1 = segment1.len + segment2.len;
			 pointer.x = origin1.x + ix1;
			 pointer.y = origin1.y + iy1;
		}
		
		// target position 2
		var ix2 = pointer.x - origin2.x;
		var iy2 = pointer.y - origin2.y;
		targetSqrDist2 = ix2 * ix2 + iy2 * iy2;
		
		targetDistance2 = Math.sqrt(targetSqrDist2);
		if ( targetDistance2 > segment3.len + segment4.len)
		{
			 f = (segment3.len + segment4.len) / targetDistance2;
			 ix2 *= f;
			 iy2 *= f;
			 targetSqrDist2 = ix2 * ix2 + iy2 * iy2;
			 targetDistance2 = segment3.len + segment3.len;
			 pointer.x = origin2.x + ix2;
			 pointer.y = origin2.y + iy2;
			 
				// recalculated target position 1
				var ix1 = pointer.x - origin1.x;
				var iy1 = pointer.y - origin1.y;

				// target square distances
				targetSqrDist1 = ix1 * ix1 + iy1 * iy1;
				targetDistance1 = Math.sqrt(targetSqrDist1);
				if ( targetDistance1 > segment1.len + segment2.len)
				{
					 f =  (segment1.len + segment2.len) / targetDistance1;
					 ix1 *= f;
					 iy1 *= f;
					 targetSqrDist1 = ix1 * ix1 + iy1 * iy1;
					 targetDistance1 = segment1.len + segment2.len;
					 pointer.x = origin1.x + ix1;
					 pointer.y = origin1.y + iy1;
					
				}
			
	  }
		
		if ( pointer.x < origin1.x && targetDistance1 >  (segment1.len + segment2.len) * 0.7)
		{
			 originTarget.x += xOffsetForce * (pointer.x - origin1.x)		
		} else if ( pointer.x < origin2.x && targetDistance2 >  (segment3.len + segment4.len) * 0.7)
		{
			 originTarget.x += xOffsetForce * (pointer.x - origin2.x)		
		} else if ( pointer.x > origin2.x && targetDistance2 >  (segment3.len + segment4.len) * 0.7)
		{
			 originTarget.x += xOffsetForce * (pointer.x - origin2.x)		
		} else if ( pointer.x > origin1.x && targetDistance1 >  (segment1.len + segment2.len) * 0.7)
		{
			 originTarget.x += xOffsetForce * (pointer.x - origin1.x)		
		}
		
		// first segment
		angle = Math.max(-1, Math.min( 1, 
			(targetSqrDist1 + segment1.len2 - segment2.len2) / (2 * segment1.len * targetDistance1)
		));

		theta1 = Math.atan2(iy1, ix1) - Math.acos(angle);

		segment1.x = origin1.x + segment1.len * Math.cos(theta1);
		segment1.y = origin1.y + segment1.len * Math.sin(theta1);

		// second segment
		angle = Math.max(-1, Math.min( 1, 
			(targetSqrDist1 - segment1.len2 - segment2.len2) / (2 * segment1.len * segment2.len)
		));

		theta2 = Math.acos(angle);

		segment2.x = segment1.x + segment2.len * Math.cos(theta2 + theta1);
		segment2.y = segment1.y + segment2.len * Math.sin(theta2 + theta1);

		
		// first segment
		angle = Math.max(-1, Math.min( 1, 
			(targetSqrDist2 + segment3.len2 - segment4.len2) / (2 * segment3.len * targetDistance2)
		));

		theta1 = Math.atan2(iy2, ix2) + Math.acos(angle);

		segment3.x = origin2.x + segment3.len * Math.cos(theta1);
		segment3.y = origin2.y + segment3.len * Math.sin(theta1);

		// second segment
		angle = Math.max(-1, Math.min( 1, 
			(targetSqrDist2 - segment3.len2 - segment4.len2) / (2 * segment3.len * segment4.len)
		));

		theta2 = Math.acos(angle);

		segment4.x = segment3.x + segment4.len * Math.cos(-theta2 + theta1);
		segment4.y = segment3.y + segment4.len * Math.sin(-theta2 + theta1);

		if ( !( drawnPoints.length == 0 && origin.x > 100))
		{
			var dx = 10, dy = 10;
			if ( drawnPoints.length > 0 )
			{
			 	dx = drawnPoints[drawnPoints.length-2] - segment2.x;
				dy = drawnPoints[drawnPoints.length-1] - segment2.y;
				
			}
			if ( dx*dx+dy*dy > 43)
				drawnPoints.push(segment2.x, segment2.y);
		}
		
		if ( drawnPoints.length > 3 )
		{
			ctx.beginPath();
			ctx.strokeStyle = "black";
			ctx.lineWidth = 4;
			ctx.moveTo(drawnPoints[0], drawnPoints[1]);
			for ( var i = 2; i < drawnPoints.length; i+=2)
				ctx.lineTo(drawnPoints[i], drawnPoints[i+1]);
			ctx.stroke();
		}
		// draw
		line (origin1.x, origin1.y, segment1.x, segment1.y, "gray", 8, 1, 0);
		line (segment1.x, segment1.y, segment2.x, segment2.y, "gray", 8, 1, 0);
		//line (origin1.x, origin1.y, pointer.x, pointer.y, "red", 4, 2, 2);
		
		
		line (origin2.x, origin2.y, segment3.x, segment3.y, "gray", 8, 1, 0);
		line (segment3.x, segment3.y, segment4.x, segment4.y, "gray", 8, 1, 0);
		//line (origin2.x, origin2.y, pointer.x, pointer.y, "red", 4, 2, 2);

	}

	// main loop
	
	function run() {
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		origin.x = xAttractionFactor * origin.x + (1.0-xAttractionFactor) * originTarget.x;
		origin.y = xAttractionFactor * origin.y +(1.0-xAttractionFactor) * originTarget.y;
		origin1.x = origin.x - armSpacing;
		origin2.x = origin.x + armSpacing;
		origin1.y = origin2.y = origin.y ;
		time += 0.1
		pointer.x = 100 + (time * 20 + Math.cos(99+( 1 + 0.05*Math.cos(123+time*1.01))*time) * 100);
		pointer.y = canvas.height * 0.5 + Math.sin(1.23*time)* (canvas.height*0.1 + canvas.height*0.25*  Math.sin(10+1.7*time));
		
		drawTarget.x = drawTargetForce * drawTarget.x + (1.0-drawTargetForce) * pointer.x;
		drawTarget.y = drawTargetForce * drawTarget.y + (1.0-drawTargetForce) * pointer.y;
		
		inverse_kinematic();
		
		
		
		if ( time > canvas.width / 24 )
		{
			time -= canvas.width / 24;
			drawnPoints = [];
		}
		requestAnimationFrame(run);
	}

	// init

	var canvas   = ge1doot.canvas("canvas");
	var ctx      = canvas.ctx;
	var pointer  = {x:0,y:0}//canvas.pointer;

	if (!ctx.setLineDash) {
		ctx.setLineDash = function () {}
	}
	
	var drawnPoints = []
	
	var origin1   = {x:-30, y:220};
  var origin2   = {x:30, y:220};
	var origin    = {x:0, y:220 };
	var originTarget = {x:0, y:220 };
	var drawTarget = {x:0, y:220 };
	var drawTargetForce = 0.77;
	var xAttractionFactor = 0.92;
	var xOffsetForce = 0.2;
	var armSpacing = 40;
	
	
	var segment1 = new Segment();
	var segment2 = new Segment();

	var segment3 = new Segment();
	var segment4 = new Segment();

	var time = 0;
	
	canvas.resize = function () {

		origin.x = originTarget.x = canvas.width / 2;
		origin.y = originTarget.y = canvas.height * 0.9;
		
		origin1.x = origin.x - armSpacing;
		origin2.x = origin.x + armSpacing;
		origin1.y = origin2.y = origin.y ;
		var length   = Math.min(canvas.width, canvas.height) / 3;
		segment1.length = length;
		segment2.length = length;
		segment3.length = length;
		segment4.length = length;
		pointer.x = origin1.x;
		pointer.y = origin1.y - length;
	}

	canvas.resize();
	run();
	
	pointer.move = function () {
		
		requestAnimationFrame(run);
		
	}

}();