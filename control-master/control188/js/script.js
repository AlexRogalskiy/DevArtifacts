		(function($){
			$.fn.scrollFixed = function(params){
			params = $.extend( {appearAfterDiv: 0, hideBeforeDiv: 0}, params);
			var element = $(this);

			if(params.appearAfterDiv)
				var distanceTop = element.offset().top + $(params.appearAfterDiv).outerHeight(true) + element.outerHeight(true);
			else
				var distanceTop = element.offset().top;

			if(params.hideBeforeDiv)
				var bottom = $(params.hideBeforeDiv).offset().top - element.outerHeight(true) - 10;
			else
				var bottom = 200000;				
			
				$(window).scroll(function(){	
					if( $(window).scrollTop() > distanceTop && $(window).scrollTop() < bottom ) 		
						element.css({'position':'fixed', 'top':'5px'});
					else
						element.css({'position':'static'});				
				});			  
			};
		})(jQuery);
		
		$(document).ready( function(){
			$("#scrollingDiv").scrollFixed({appearAfterDiv:'.sidebar p', hideBeforeDiv:'.footer'});
			$("#scrollingDiv1").scrollFixed({hideBeforeDiv:'.footer'});
		});