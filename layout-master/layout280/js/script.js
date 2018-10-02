jQuery(document).ready(function($) {
	$('#list').click(function(event) {
		event.preventDefault();
		$('#products').addClass('list-group-wrapper').removeClass('grid-group-wrapper');
});
	$('#grid').click(function(event) {
		event.preventDefault();
		$('#products').removeClass('list-group-wrapper').addClass('grid-group-wrapper');
	});
});