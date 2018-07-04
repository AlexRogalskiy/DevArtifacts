$(function() {
	$("#card-second").click(function() {
		$(".card-second").toggleClass("card-second-up");
		$(".actions-active").toggleClass("actions-active-up");
		$(".stats-before").toggleClass("stats-after");
		$(".display-before").toggleClass("display-after");
	});
});

$(function() {
	$("#card-third").click(function() {
		$(".card-second").removeClass("card-second-up");
		$(".actions").removeClass("actions-active-up");
		$("#stats").removeClass("stats-after").addClass("stats-before");
		$(".display").removeClass("display-after");
		
		$(".card-second").toggleClass("card-second-left");
		$(".card-first").toggleClass("card-first-left");
		$(".card-third").toggleClass("card-third-left");
		$(".line-active").toggleClass("line-active-right");
	});
});

$(function() {
	$("#card-first").click(function() {
		$(".card-second").removeClass("card-second-up");
		$(".actions").removeClass("actions-active-up");
		$("#stats").removeClass("stats-after").addClass("stats-before");
		$(".display").removeClass("display-after");
		
		$(".card-second").toggleClass("card-second-right");
		$(".card-first").toggleClass("card-first-right");
		$(".card-third").toggleClass("card-third-right");
		$(".line-active").toggleClass("line-active-left");
	});
});

$(function() {
	$(".start").click(function() {
		$(".card-second").toggleClass("card-second-study");
		$("#study-name").toggleClass("study-name-after");
		$("#card-third").toggleClass("card-third-study");
		$("#card-first").toggleClass("card-first-study");
		$(".actions").toggleClass("actions-study");
		$(".bar").toggleClass("bar-study");
		$(".line-active").toggleClass("line-active-study");
		$(".stats-before").toggleClass("stats-study");
		$(".wrapper").toggleClass("wrapper-study");
		$(".display").toggleClass("display-none");
		$(".term-second-before").toggleClass("term-second-after");
		$(".nav-bottom").toggleClass("nav-bottom-after");
		$("#term-content").toggleClass("term-content-after");
		
		$(".card-second").removeClass("card-second-up");
		$("#nav-bottom").removeClass("nav-bottom-hide");
	});
});

$(function() {
	$("#back").click(function() {
		$(".card-second").removeClass("card-second-study");
		$(".card-second").removeClass("card-second-up");
		$("#study-name").removeClass("study-name-after");
		$("#card-third").removeClass("card-third-study");
		$("#card-first").removeClass("card-first-study");
		$(".actions").removeClass("actions-study");
		$(".bar").removeClass("bar-study");
		$(".line-active").removeClass("line-active-study");
		$(".stats-before").removeClass("stats-study");
		$(".wrapper").removeClass("wrapper-study");
		$(".display").removeClass("display-none");
		$(".term-second-before").removeClass("term-second-after");
		$(".nav-bottom").removeClass("nav-bottom-after");
		$(".actions-active").removeClass("actions-active-up");
		$(".stats-before").removeClass("stats-after");
		$(".display-before").removeClass("display-after");
		$("#term-content").removeClass("term-content-after");
		
		$("#nav-bottom").toggleClass("nav-bottom-hide");
	});
});