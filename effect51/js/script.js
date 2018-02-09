(function($,window) {
	var $win = $(window),
	size = $win.width();

		var showTimer = setInterval(function() {
			$("#featured-jobs ol").showtimer();
		}, 5000);

		$('#featured-jobs ol li:first').addClass('active');
		jQuery.fn.showtimer = function() {
			if(!$(this).children('li:last-child').hasClass('active')){
				$(this).children('li.active')
					.removeClass('active')
					.next('li').addClass('active');
			}
			else{
				$(this).children('li.active')
					.removeClass('active')
				.end().children("li:first")	
					.addClass('active');
			}
		} 

		$('#featured-jobs ol li').click(function(e){
			e.preventDefault();
			$('#featured-jobs ol li').removeClass('active');
			$(this).addClass('active');
			clearInterval(showTimer);
			showTimer = setInterval(function() {
				$("#featured-jobs ol").showtimer();
			}, 5000);
		});


}(jQuery,window));