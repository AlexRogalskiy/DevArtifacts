//$browserWidth = $(document).width();
//alert($browserWidth);
makeTimer();
function makeTimer() {

			var endTime = new Date("07/15/2015 15:50:00");			
			var endTime = (Date.parse(endTime)) / 1000;

			var now = new Date();
			var now = (Date.parse(now) / 1000);

			var timeLeft = endTime - now;
  		if (timeLeft <= 0){
        $("#timer").html("THE TIME IS NOW!");
        $("#timer").css('text-align', 'center');
      }

			var days = Math.floor(timeLeft / 86400); 
			var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
			var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
			var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));
      //var seconds = timeLeft;

			if (hours < "10") { hours = "0" + hours; }
			if (minutes < "10") { minutes = "0" + minutes; }
			if (seconds < "10") { seconds = "0" + seconds; }

			$("#days").html(days + "<span>D</span>");
			$("#hours").html(hours + "<span>H</span>");
			$("#minutes").html(minutes + "<span>M</span>");
			$("#seconds").html(seconds + "<span>S</span>");		

	}

	setInterval(function() { makeTimer(); }, 1000);