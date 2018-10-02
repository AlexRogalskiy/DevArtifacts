/* Change the bg on article click */
$('.posts article').click(function(){
	$(this).addClass('active back');
	$('.posts article').not(this).removeClass('active back');
	$('.feed').css('width', 'calc(64px * 7)');
});

/**/
$('.posts article').not('.active').hover(function(){
	$('.feed').css('width', 'calc(64px * 7)');
	$('header').css('transform', 'translateX(64px)');
});

$('.posts article').mouseleave(function(){
	$('.feed').css('width', 'calc(64px * 6)');
	$('header').css('transform', 'translateX(0px)');	
})

/* More posts */
$('.more').click(function(){
	$('.posts').css('left', '-100%');
});

$('.less').click(function(){
	$('.posts').css('left', '0');
});

/* SHow sidebar */
$('.side-l-r').click(function(){
	$('.feed').toggleClass('move');
})

/* Slider */
function Slider($sliderContainer) {
	var self = this;
	var $win = $(window);
	var $sliderContent = $sliderContainer.find(">ul");
	var $slides = $sliderContent.find(">li");
	var $pages = $();
	var $nav = $();
	var slidesCount = $slides.length;
	var speed = 400;
	var flickTimeout = 400;
	var swipeThreshold = 10;
	var autorotateInterval = $sliderContainer.data("autorotate");
	var transitioning = false;
	var touchMoving = false;
	var transition = Modernizr.prefixed("transition");
	var transitionend = {
		"WebkitTransition" : "webkitTransitionEnd",
		"MozTransition"    : "transitionend",
		"OTransition"      : "oTransitionEnd",
		"msTransition"     : "MSTransitionEnd",
		"transition"       : "transitionend",
		"false"            : "transitionend"
	}[transition];
	var sliderWidth, currentIndex, startX, startY, deltaX, deltaY, isFlick, swiping, transitioning, autorotateTimer;

	if (slidesCount < 2) return;

	function init() {
		var $pager = $("<span/>");
		$nav = $("<div class='nav'/>").append($pager);

		currentIndex = ($slides.filter(".current").index() + 1 || 1) -1;
		$sliderContent.width(100 * slidesCount + "%");
		$slides.width(100 / slidesCount + "%");
		$slides.each(function(i) {
			$("<a>" + (i+1) + "</a>").appendTo($pager)
			.on("touchstart", function(e) {
				e.preventDefault();
				$(this).one("touchend", function(e) {
					e.preventDefault();
					if (touchMoving) return false;
					go(i);
				});
			}).on("click", function(e) {
				e.preventDefault();
				if (touchMoving) return false;
				go(i);
			});
		});
		$("<a class='back'>&lt;</a>").prependTo($nav)
		.on("touchstart", function(e) {
			e.preventDefault();
			$(this).one("touchend", function(e) {
				e.preventDefault();
				if (touchMoving) return false;
				back();
			});
		}).on("click", function(e) {
			e.preventDefault();
			if (touchMoving) return false;
			back();
		});
		$("<a class='forth'>&gt;</a>").appendTo($nav)
		.on("touchstart", function(e) {
			e.preventDefault();
			$(this).one("touchend", function(e) {
				e.preventDefault();
				if (touchMoving) return false;
				forth();
			});
		}).on("click", function(e) {
			e.preventDefault();
			if (touchMoving) return false;
			forth();
		});

		$pages = $pager.find(">a");
		$pages.eq(currentIndex).addClass("active");
		arrange($slides.eq(currentIndex));
		moveBy(0, true);

		$sliderContainer.append($nav);
		window.setTimeout(function() {
			$sliderContainer.addClass("ready");
		}, 0);

		$win.on("resize orientationchange", function() {
			sliderWidth = $sliderContainer.width();
		}).trigger("resize");
		$sliderContent.on("touchstart", touchstart);
		if (!!autorotateInterval && !Modernizr.touch) {
			autorotateInterval = autorotateInterval * 1000;
			$sliderContainer.on("mouseenter", function() {
				autorotate(0);
			}).on("mouseleave", function() {
				autorotate(autorotateInterval);
			});
			autorotate(autorotateInterval);
		}
	}

	function isSwipe(threshold) {
		return Math.abs(deltaX) > Math.max(threshold, Math.abs(deltaY));
	}

	function touchstart(e) {
		if (transitioning) return false;
		touchMoving = true;
		//e.preventDefault(); // for testing on desktop, remove later
		deltaX = deltaY = 0;
		if (e.originalEvent.touches.length == 1) {
			startX = e.originalEvent.touches[0].pageX;
			startY = e.originalEvent.touches[0].pageY;
			$sliderContent.on("touchmove touchcancel", touchmove).one("touchend", touchend);
			isFlick = true;
			window.setTimeout(function() {
				isFlick = false;
			}, flickTimeout);
		}
	}

	function touchmove(e) {
		deltaX = startX - e.originalEvent.touches[0].pageX;
		deltaY = startY - e.originalEvent.touches[0].pageY;
		if (isSwipe(swipeThreshold)) {
			e.preventDefault();
			e.stopPropagation();
			swiping = true;
		}
		if (swiping) {
			moveBy(deltaX / sliderWidth, true)
		}
	}

	function touchend(e) {
		var threshold = isFlick ? swipeThreshold : sliderWidth / 2;
		if (isSwipe(threshold)) {
			deltaX < 0 ? back() : forth();
		} else {
			// if swipe threshold is not reached, transition back if X != 0, but don't turn transition on if we landed directly on X == 0
			moveBy(0, !deltaX);
		}
		swiping = false;
		$sliderContent.off("touchmove", touchmove).one(transitionend, function() {
			moveBy(0, true);
			touchMoving = false;
		});
	}

	function moveBy(direction, instantly) {
		var deltaX = -(direction + currentIndex) * 100;
		var s = instantly ? 0 : speed;
		if (!!transition && Modernizr.csstransforms3d) {
			$sliderContent.css({
				// left: deltaX + "%", // sloppy on android
				transform: "translate3d(" + deltaX / slidesCount + "%,0,0)", // flickering on iOS
				// transform: "translate(" + deltaX / slidesCount + "%,0)", // best compromise - only strange on android stock browser
				transition: ["all ", s, "ms"].join("")
			});
		} else {
			$sliderContent.animate({
				left: deltaX + "%"
			}, s, function() {
				s && $sliderContent.trigger(transitionend);
			});
		}
	}

	function go(targetIndex, direction) {
		if (transitioning) return false;
		if (typeof targetIndex != "number" || targetIndex == currentIndex || transitioning) return;
		transitioning = true;
		var targetIndex = targetIndex % slidesCount;
		var $currentSlide = $slides.filter(".current");
		currentIndex = $currentSlide.index();
		if (!direction) {
			$slides.eq(targetIndex).addClass("target");
		}
		direction = direction || targetIndex - currentIndex;

		moveBy(direction);

		$sliderContent.one(transitionend, function() {
			arrange($slides.eq(targetIndex));
			transitioning = false;
			if ((direction == 1 && targetIndex == 0)
				|| (direction == -1 && targetIndex == slidesCount - 1)) {
				moveBy(0, true);
			}
		});

		$pages.length && $pages.removeClass("active").eq(targetIndex).addClass("active");
	}

	function forth() {
		go($slides.filter(".next").index(), 1);
	}

	function back() {
		go($slides.filter(".prev").index(), -1);
	}

	function arrange($currentSlide) {
		var $prevSlide = $currentSlide.prev().length ? $currentSlide.prev() : $slides.last();
		var $nextSlide = $currentSlide.next().length ? $currentSlide.next() : $slides.first();
		currentIndex = $currentSlide.index();
		$slides.removeClass("current prev next target last-child");
		$currentSlide.addClass("current");
		$prevSlide.addClass("prev")
			.filter(":last-child").addClass("last-child"); // for IE7 support only
		$nextSlide.addClass("next");
	}

	function autorotate(interval) {
		if (interval) {
			autorotateTimer = window.setInterval(forth, interval);
		} else {
			clearInterval(autorotateTimer);
		}
	}

	init();
}

$(".js_slider").each(function() {
	var slider = new Slider($(this));
});
