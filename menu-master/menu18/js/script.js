$(".close").click(function(){
	$('.outside').toggleClass('in');
	$('.bar').toggleClass('active');
	$(this).toggleClass('is-showing');
});