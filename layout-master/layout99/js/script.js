$(function() {
	$("#click").click(function() {
		$("#move").toggleClass("wrapper-move");
	});
});

$(function() {
	$("#remove").click(function() {
		$("#move").removeClass("wrapper-move");
	});
});