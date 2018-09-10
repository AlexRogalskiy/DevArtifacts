/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

(function($){
	$.fn.jSlickmenu = function(options) {
	   
		var defaults = {
			speed : 200,
			fadeopacity : 0.33,
			infomargin : 10,
			leftmargin : 130,
			css3rotate : true,
			css3shadow : '#555 3px 5px 5px',
			css3borderradius : 5,
			borderneutral : 3,
			borderhover : 10
		};
		
		var options = $.extend(defaults, options);
	   
		return this.each(function() {
			// override the ID
			this.id = "slickmenu";
			
			// Get the child elements and do funny stuff with them
			for(var i = 0; i < $("#slickmenu ul").children().size(); i++) {

				// Calculate the top-margin (turn based) + randomly calculate the rotation
				var margin;
				var rotation;
				if(i % 2) {
					margin = randomXToY(10, 30) + 'px';
					
					if(options.css3rotate) {
						rotation = randomXToY(0, 20) + 'deg'; // rotate right;
					}
				} else {
					margin = randomXToY(-15, -5) + 'px';
					
					if(options.css3rotate) {
						rotation = randomXToY(340, 360) + 'deg'; // rotate left
					}
				}

				// Retrieve the current list item
				var li_item = $("#slickmenu ul li:nth-child("+ (i+1) +")");

				// Apply some CSS to the list item
				li_item.css({
					'margin-left' : i * options.leftmargin +'px',
					'margin-top' : margin,
					'-webkit-transform' : 'rotate('+rotation+')',
					'-moz-transform' : 'rotate('+rotation+')',
					'transform' : 'rotate('+rotation+')'
				});
				
				// Apply some CSS3 (rounded corner) to the image of the list item
				li_item.children().children().css({
					'-moz-border-radius' : options.css3borderradius + 'px',
					'-webkit-border-radius' : options.css3borderradius + 'px',
					'border-radius' : options.css3borderradius + 'px'
				});
				
			} // end for
			
			// Handle for the z-index of the items
			var curzindex = 1;
			
			// Append the "hover" effect to the menu
			$("#slickmenu ul li a img").hover(function(){
				
				curzindex++;
		
				$(this).parent().parent()
					.css({'z-index' : curzindex })
					.siblings().stop().fadeTo(options.speed, options.fadeopacity);
					
				$(this)
					.stop()
					.before('<div class="infobox">' + $(this).attr("alt") + '</div>')
					.css({
						'-webkit-box-shadow' : options.css3shadow,
						'-moz-box-shadow' : options.css3shadow,
						'box-shadow' : options.css3shadow
					})
					.animate({ borderWidth : options.borderhover + 'px'}, options.speed);
					
				var backrotation = 'rotate(-' + retrieveDegrees($(this).parent().parent().css('-webkit-transform')) + 'deg)';
				
				$(".infobox").css({'margin-top' : '-' + ($(".infobox").height() + options.infomargin) + 'px',
					'-webkit-transform': backrotation,
					'-moz-transform': backrotation,
					'-transform': backrotation,
					'-moz-border-radius' : '3px',
					'-webkit-border-radius' : '3px',
					'border-radius' : '3px',
					'-webkit-box-shadow' : options.css3shadow,
					'-moz-box-shadow' : options.css3shadow,
					'box-shadow' : options.css3shadow
					})
					.after('<div class="infobox-arrow"></div>')
					.slideToggle(options.speed);
					
				$(".infobox-arrow").css({'-webkit-transform' : backrotation,
					'margin-top' : '-' + (options.infomargin - 8 ) + 'px' })
					.slideToggle(options.speed);
				
			}, function(){
				$(".infobox").remove();
				$(".infobox-arrow").remove();
				
				$(this).parent().parent()
					.siblings().stop().fadeTo(options.speed, 1);
					
				$(this)
					.stop()
					.css({
						'-webkit-box-shadow' : '',
						'-moz-box-shadow' : '',
						'box-shadow' : ''
					})
					.animate({ borderWidth : options.borderneutral + 'px'}, options.speed);
			});
			
		});
		
		// Function to get random number upto m
		// http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
		function randomXToY(minVal,maxVal,floatVal) {
			var randVal = minVal+(Math.random()*(maxVal-minVal));
			return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
		}
		
		// When retrieving "webkit-transform", a "rotate(xdeg)" will be returned.
		// This function strips the "rotate(" and "deg)" to only retrieve the number.
		function retrieveDegrees(rotationdeg) {
			var chopped = rotationdeg.substring(7, rotationdeg.length);
			return parseInt(chopped.substring(0, chopped.length - 4));
		}
		
	};
})(jQuery);