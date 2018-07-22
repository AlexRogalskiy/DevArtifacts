function toggleSidebar() {
	$(".sidebar-wrapper").toggleClass("open");
}

function toggleDarkMode() {
	$(".app-container").toggleClass("dark");

	if ($(".app-container").hasClass("dark")) {
		$("#darkMode").html("check_box");
		$("#darkMode")
			.parent()
			.addClass("active");
	} else {
		$("#darkMode").html("check_box_outline_blank");
		$("#darkMode")
			.parent()
			.removeClass("active");
	}
}

function toggleChat() {
	$(".app-container").toggleClass("chat");
}

$(".dropdown-toggle").on("click", function(e) {
	$parent = $(this).parent();

	var remove = false;
	if ($parent.hasClass("open")) {
		remove = true;
	}

	setTimeout(function() {
		if (remove) {
			$parent.removeClass("open");
		} else {
			$parent.addClass("open");
		}
	}, 0);
});

$(window).on("click", function() {
	$(".dropdown").removeClass("open");
});

$(".mobile-search .dropdown-toggle").on("click", function(e) {
	$(".mobile-search input").focus();
});

$(".mobile-search input").on("click", function(e) {
	e.stopPropagation();
});