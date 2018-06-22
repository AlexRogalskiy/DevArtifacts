$(".screen").click(function() {
	var el = $(this),
			newone = el.clone(true);
	
	el.before(newone);
	$(el).remove();
});