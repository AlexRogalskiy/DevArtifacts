$('.dropdown-button').on('click', function () {
	$('.dropdown').removeClass('is-open');
	$(this).closest('.dropdown').toggleClass('is-open');
});
