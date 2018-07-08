$(".screen").click(function() {
	var el = $(this),
			newone = el.clone(true);
	
	el.before(newone);
	$(el).remove();
});$(".screen").click(function() {
	var el = $(this),
			newone = el.clone(true);
	
	el.before(newone);
	$(el).remove();
});