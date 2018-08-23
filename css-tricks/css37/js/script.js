var $button = $('.button');
var $element = $('.element');
var $disabler = $('.disabler');

$disabler.on('click', function() {
	$element.toggleClass('disabled');
});

$('.container').on('foobar', function() {
	console.log('foobar event has bubbled to container');
});

$element.on('foobar', function(event) {
	console.log('Primary handler');
	
	if ($element.hasClass('disabled')) {
		console.log('The element is disabled, not gonna do anything.');
		
		event.stopImmediatePropagation();
		return false;
	}
	
	console.log('Primary handler complete.');
});

// --------------

$button.on('click', function(event) {
	console.clear();
	
	$element.trigger('foobar');
	
	setTimeout(function() {
		$element.removeClass('active');
	}, 650);
});


$element.on('foobar', function(event) {
	console.log('External handler');
	$element.addClass('active');
});
