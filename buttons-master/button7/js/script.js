var row = $(".row");
var cancel = $(".cancel");
var arrrow = $(".arrow");

$(function() {
	row.click(function() {
    row.removeClass("state_active");
    $(this).toggleClass("state_active");
	});
});

$(function() {
	$(".arrow").click(function() {
    row.removeClass("state_active");
	});
});