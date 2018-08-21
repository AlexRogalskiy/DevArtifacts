$(function(){
	$("input").click(function(){
		if(this.checked) {
			$(this).parent().addClass("on");
		} else {
			$(this).parent().removeClass("on");
		}
	});
}); 