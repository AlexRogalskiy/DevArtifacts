		$(document).ready(function() {		
			$("#logocontainer").mouseenter(function() {
				$(".eyeround").stop().animate({
					height: "20px"
				});
			}).mouseleave(function() {
				$(".eyeround").stop().animate({
					height: "40px"
				});
			});
		});
