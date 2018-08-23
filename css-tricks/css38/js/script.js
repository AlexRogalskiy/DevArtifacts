$('button').on('click', function(event) {
	
	$(this).trigger('foo');
});

$('.container div').on('foo', function(event) {
	console.log('event so far:', event.payload);
	event.payload = event.payload ? 'q' : '' + '-' +$(this).get(0).classList;	
});

$('.container').on('foo', function(event) {
	console.log(event.payload);
});