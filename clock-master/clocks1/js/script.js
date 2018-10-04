// measure the length of the SVG path. All four will be the same
var pathLength = document.getElementById('minutesA').getTotalLength();

// calculate portion of pathLength that corresponds to
// one second and create global var
var addSecond = pathLength/60;
var second = 0;

// calculate portion of pathLength that corresponds to
// one second in one minute and create global var
var addMinuteSecond = addSecond/60;
var minute = 0;

// calculate degrees out of 360 that represent one second
// in a 12 hour period and create global var
var addHourSecond = ((360/12)/60)/60;
var hour = 0;

// ∞∞ build clock fn
function buildClock() {
	var clock = $('#clock');
	
	// retreive desired width
	var width = clock.data('width');
	var imgSrc = 'http://udy.io/rsc/img/tr_sq.png';
	var img = '<img src="' + imgSrc + '" width="100%" height="100%"/>';

	// set width and inject 10x10 px png to ensure it's a square
	clock.css({'width': width}).append(img);
}

// ∞∞ set clock fn
function setClock() {
	// get JS Date
	var time = new Date();
	
	// get seconds and convert to clock units
	var getSecond = time.getSeconds();
	var setSecond = getSecond*addSecond;

	// get minutes and convert to clock units
	var getMinute = time.getMinutes();
	var setMinute = getMinute*addMinuteSecond*60;

	// get hours
	var getHour = time.getHours();
	
	// convert 13h to 23h to 12h time
	var splitDay = (getHour > 11) ? getHour-12 : getHour;
	
	// convert hours to number of degrees (30deg per hour)
	// and add minutes to hour hand for continuous animation
	var setHour = (splitDay*30)+(getMinute*(addHourSecond*60));
	
	// prepare SVG paths
	$('#minutesB').css({'stroke-dasharray': pathLength});
	$('#seconds').css({'stroke-dasharray': pathLength/60 + ' ' + (pathLength/60)*59});
	
	// add necessary running transition
	setTimeout(function() {
		$('#minutesB, #seconds').css({'transition': 'all 1s linear'});
		
		// set clock
		setTimeout(function() {
			$('#seconds').css({'stroke-dashoffset': setSecond});
			$('#minutesB').css({'stroke-dashoffset': setMinute});
			$('#hour span').css({'transform': 'rotate(' + setHour + 'deg)'});
		}, 50);
	}, 50);
	
	// refresh global vars
	second = setSecond+addSecond;
	minute = setMinute+addMinuteSecond;
	hour = setHour+addHourSecond;
}

// ∞∞ run clock fn
function runClock() {
	
	// add global var values to correct elements
	$('#seconds').css({'stroke-dashoffset': second});
	$('#minutesB').css({'stroke-dashoffset': minute});
	$('#hour span').css({'transform': 'rotate(' + hour + 'deg)'});

	// refresh global vars
	second += addSecond;
	minute += addMinuteSecond;
	hour += addHourSecond;
}

// build
buildClock();

// use timeout to make sure elements have been built
setTimeout(setClock, 100);

// set one second intervals for running the clock
setInterval(runClock, 1000);