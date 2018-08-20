$(function() {
	
	var hex;
	
	function time(){
		var date = new Date();
  	var hrs = date.getHours();
  	var min = date.getMinutes();
		var sec = date.getSeconds();

  	//logic
  	if(hrs < 10){
		   hrs = '0' + hrs;
		} else if(hrs > 12) {
			hrs = + hrs - 12;
			hrs = '0' + hrs;
		}
		
		if(min < 10){ 
			 min = '0' + min;
		}
		
		if(sec < 10){ 
			 sec = '0' + sec;
		}
		
		hex = '#' + hrs + min + sec;
		return hrs + ':' + min + ':' + sec;
	}
	
	window.setInterval(function() {
		$('div').text(time());
		$('body').animate(1000).css('background-color', hex);
	}, 1000)
	
});