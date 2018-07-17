Modernizr.testStyles('#modernizr { display: table; height: 50px; width: 50px; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0; }', function(elem, rule) {
	Modernizr.addTest('absolutecentercontent', Math.round(window.innerHeight / 2 - 25) === elem.offsetTop);
});

// Trigger Resize
$(".trigger-Resize").on("click",function(e){
	$resizeBlock = $(this).parents(".Center-Block");
	if ( !$resizeBlock.hasClass("is-Small") ) {
	$resizeBlock.animate({ "width" : "300px", "height" : "260px" },800).addClass("is-Small");
	} else {
		$resizeBlock.animate({ "width" : "500px", "height" : "350px" },800).removeClass("is-Small");
	}
	e.preventDefault();
	e.stopPropagation();
	return false;
});

// Simple show/hide modal
$(".toggle-Modal").on("click",function(e){
	$(".Modal-Background").toggleClass("is-Hidden");
	e.preventDefault();
	e.stopPropagation();
	return false;
});


// Don't show modal on load in mobile webkit because of the document centering issue.
ua = navigator.userAgent,
isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);
if ( isMobileWebkit ) { $(".Modal, .Modal-Background").addClass("is-Hidden"); }

// Unneccessary Scroll Functionality :-)
var lastId,
		topMenu = $("#Navigation"),
		topMenuHeight = topMenu.outerHeight()+0,
		menuItems = topMenu.find("a"),
		scrollItems = menuItems.map(function(){
			var item = $($(this).attr("href"));
			if (item.length) { return item; }
		});

function highlightNav() {
	var fromTop = $(window).scrollTop()+topMenuHeight;
	var cur = scrollItems.map(function(){ if ($(this).offset().top < fromTop) { return this; } });
	cur = cur[cur.length-1];
	var id = cur && cur.length ? cur[0].id : "";
//	console.log("id",id);
	if (lastId !== id) {
			lastId = id;
			// Set/remove active class
			menuItems
				.removeClass("is-Current")
				.filter("[href=#"+id+"]").addClass("is-Current");
	}
}
highlightNav();
$(window).scroll( highlightNav );

var $links = $('[href^=#]');
var $page  = $('.browser iframe.page');
var $input = $('.browser .address-bar input');

$links.on('click', function(e){
  var $target = $(e.target);
  var hash = $target.attr('href');
  
    
  var src = window.location.href;
  src = src.split('#')[0]
  
  window.location.href = src + "#" + hash;
  e.preventDefault();
});
// jquery.arbitrary-anchor.js | briangonzalez.org/arbitrary-anchor
(function(e,t){"use strict";function a(){var n=e.location.hash.substring(1).split("|");var r=n[0];var i=n[1]||600;if(r.charAt(0).search(/[A-Za-z]/)>-1)var s=t("#"+r);var u=t('a[name="'+r+'"]');if(u&&u.length>0||s&&s.length>0)return;var a=t(r).first();if(a&&a.length>0){var f=a}else{return}if(f&&f.length>0){var l=f.offset().top;o.stop(true,false).animate({scrollTop:l},parseInt(i))}}var n,r,i,s,o;var u=750;t(document).ready(function(){n=t(e);r=t(this);i=r.find("body");s=r.find("html");o=i.add(s);a();n.on("hashchange",a);n.on("mousewheel DOMMouseScroll touchstart mousedown MSPointerDown",function(e){o.stop(true,false)})})})(window,jQuery)
