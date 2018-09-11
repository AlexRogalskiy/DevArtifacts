$(window).load(function() {

$(window).resize(function() {
winHeight = $(window).height();
marginPos = 0;
topPos = window.pageYOffset;

curtains = $('.curtain').length-1;
pad=parseInt($('.curtain').css('padding-top'));

$('.curtain').each(function() {

$(this).css({marginTop:marginPos});
marginPos = marginPos+$(this).height()+(pad*2);
if ($(this).index()<curtains) {
$(this).css({top:-topPos});
}
if ($(this).index()==curtains) {
$(this).css({minHeight:winHeight-(pad*2)});
$(this).find('.inner').css({minHeight:winHeight-(pad*2)});
}

});

}).resize();


window.onscroll = function ()  {
winHeight = document.documentElement.clientHeight;
topPos = (document.documentElement.scrollTop + document.body.scrollTop == document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop;
botPos = topPos+winHeight;

$('.curtain').each(function() {
	opaque = 1;

	if ($(this).index()<curtains) {
		thisHeight = $(this).height();
		thisTop = winHeight - thisHeight;
		thisPos = parseInt($(this).css('margin-top'));
		if (topPos>thisPos && botPos>(thisPos+thisHeight)) {
			if (thisTop>0) {thisTop = 0;}
			$(this).css({top:-thisPos+thisTop});
			opaque = 1-((topPos-thisPos+thisTop)/thisHeight);
		} else {$(this).css({top:-topPos});}
	}
	$(this).css({opacity:opaque});
});

}

/* for touch screens to dynamically set scrolltop */

if ('ontouchstart' in window || navigator.msMaxTouchPoints) {

	var scrollStart = 0;

	document.addEventListener('touchstart', function(e) {
		scrollStart =  window.pageYOffset; + e.touches[0].clientY;
	});

	document.addEventListener('touchmove', function(e) {
		window.pageYOffset(scrollStart-e.touches[0].clientY);
		e.preventDefault();
	});
}


});