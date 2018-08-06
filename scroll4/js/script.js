/* Write code on document load */
$(document).ready(function() {
    var scrollTrigger= $("*[scroll-trigger]");
    scrollTrigger.bind('click', function(e) {
        e.preventDefault(); // prevent hard jump, the default behavior
        var _this = $(this); 
        var triggerAttr = _this.attr('scroll-trigger'); 
        var scrollTarget = $('*[scroll-target='+triggerAttr+']');  // Set the target as variable

        // perform animated scrolling by getting top-position of target-element and set it as scroll target
		$('html, body').stop().animate({
				scrollTop: scrollTarget.offset().top - 0
		}, 600 );
        return false;
    });   
});
