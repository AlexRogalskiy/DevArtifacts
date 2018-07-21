/* 
  if you thought the CSS was tedious, the real pain starts here.  
  We need to tell each bar when to animate, relative
  to the master timeline. To do this Im building a master JSON, referencing each
  row -> bars -> specific bar delay.
*/

// the data map
var timetable = {
	'row1': { 'bar1': "0.48" },
	'row3': { 'bar1': "0.56", 'bar3': "0.52" },
	'row4': { 'bar1': "0.8", 'bar4': "0.68" },
	'row5': { 'bar2': "0.72", 'bar3': "0.76", 'bar5': "0.64" },
	'row6': { 'bar2': "0.76", 'bar5': "0.64", 'bar6': "0.6" },
	'row7': { 'bar1': "1", 'bar3': "0.76", 'bar4': "1.08", 'bar6': "0.88" },
	'row8': { 'bar1': "0.8", 'bar2': "0.8", 'bar5': "0.8", 'bar6': "0.8", 'bar9': "0.68" },
	'row9': { 'bar2': "0.8", 'bar3': "0.64", 'bar6': "1.04", 'bar8': "0.72" },
	'row10': { 'bar1': "0.64", 'bar3': "0.36", 'bar4': "0.72", 'bar5': "0.84", 'bar7': "1", 'bar9': "0.48", 'bar10': "0.84" },
	'row11': { 'bar2': "0.56", 'bar4': "0.36", 'bar7': "0.68", 'bar8': "0.56", 'bar10': "0.44", 'bar11': "0.52" },
	'row12': { 'bar2': "0.28", 'bar3': "0.28", 'bar6': "0.44", 'bar7': "0.52", 'bar10': "0.3", 'bar11': "0.12" },
	'row13': { 'bar1': "0.12", 'bar2': "0.16", 'bar4': "0.28", 'bar7': "0.64", 'bar8': "0.44", 'bar10': "0.64", 'bar13': "0.72" }
}





// runs a loop and appends each bar timeline to master argument
function setupTimeline(elems, master) {
	_.each(elems, function(k, v, i){
		_.each(k, function(m, n, o){
			master.add( getBarTween(v, n), m );
		});
	});
}

// generates animation timeline for a single bar
function getBarTween(row, bar) {
	
	// create mini timeline
	var timeline = new TimelineMax();
	
	// set up reference variables
	var $bar = $('.' + row).find('.' + bar);
	var $b = $bar.find('.bridge'),
		$s = $bar.find('.dot-a'),
		$e = $bar.find('.dot-b');
	
	// create timeline = @TODO check out the "from" state to see if we can do that here instead of CSS
	timeline.to($bar, 0.28, { scale: 1, opacity: 1, delay: '0.08' })
			.to($b, 0.32, { right: '-4px', ease: Power1.easeOut} )
			.to($e, 0.0002, { opacity: 1 }, '+=0.08')
			.to($b, 0.32, { left: '85%', ease: Power4.easeOut }, '+=.04')
			.to($b, 1.64, { opacity: 0 });
	
	return timeline;
}

// make the master timeline
var masterTimeLine = new TimelineMax({paused: true});

// append children timelines
setupTimeline(timetable, masterTimeLine);

// launch the master timeline after everything has been added
masterTimeLine.play();





// controls for toggling animation versions
$('.action-replay').on('click', function(){
	if (masterTimeLine.yoyo()) {
		masterTimeLine.pause(0, true).yoyo(false).repeat(0).play();
	} else {
		masterTimeLine.restart()
	}
});

$('.action-reverse').on('click', function(){
	masterTimeLine.reverse(-0.64)
});

$('.action-yo-yo').on('click', function(){
	masterTimeLine.pause(0, true).yoyo(true).repeat(3).play(0.5);
});
