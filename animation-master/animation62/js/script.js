var row = $(".row");
var cancel = $(".cancel");
var set = $(".set");

$(function() {
	row.click(function() {
    row.removeClass("state_active");
    $(this).toggleClass("state_active");
	});
});

$(function() {
	cancel.click(function() {
    row.removeClass("state_active");
	});
});

$(function() {
	set.click(function() {
    $(".frame").toggleClass("state_hide");
    row.removeClass("state_active");
	});
});