/*!
**********************************************************
* StickyStack.js
* 
* Version:		v1.1.2
* Author:		Mike Zarandona
* Release:		June 24 2014
* 				Added a fix for sections that are taller than the screen
* 
* Reqs:			jQuery
* 
* Usage:		$('.main-content-wrapper').stickyStack({
*					containerElement:	'.main-content-wrapper',
*					stackingElement:	'section',
*					boxShadow:			'0 -3px 20px rgba(0, 0, 0, 0.25)'
*				});
**********************************************************
*/
!function(a,b){a.fn.stickyStack=function(b){function f(a){for(var b=0,d=0;d<a;d++)b+=c.eq(d).outerHeight(!0);c.eq(0).parent().css("padding-top",b);for(var e=0;e<c.length;e++)a>0?(c.eq(e).addClass("stuck"),a--):c.eq(e).removeClass("stuck")}function g(){for(var b=0,e=a(window).outerHeight(!0),f=0;f<c.length;f++)d[f]=[],d[f][1]=c.eq(f).outerHeight(!0),d[f][1]>e?(d[f][2]=d[f][1]-e,c.eq(f).addClass("align-bottom")):(d[f][2]=0,c.eq(f).removeClass("align-bottom")),c.eq(f).attr("data-scrollto",c.eq(f).offset().top),c.eq(f).hasClass("stuck")?(d[f][0]=b,b+=d[f][1]):d[f][0]=c.eq(f).offset().top,c.eq(f).attr("data-scrollto",d[f][0]).attr("data-height",d[f][1]).attr("data-offset",d[f][2])}b=a.extend({},a.fn.stickyStack.options,b);var c=a(b.containerElement+" > "+b.stackingElement),d=[],e=b.stackingElement+"{box-sizing: border-box;-moz-box-sizing: border-box;position: relative;z-index: 100;}"+b.stackingElement+".stuck {position: fixed;top: 0;z-index: 0;}"+b.stackingElement+".stuck + "+b.stackingElement+":not(.stuck) {box-shadow: "+b.boxShadow+";}"+b.stackingElement+".stuck.align-bottom {top: auto !important;bottom: 0 !important;}";a("head").append('<style id="sticky-stack-styles" type="text/css">'+e+"</style>"),a(document).ready(function(){g();var a=c.eq(0).outerWidth(!0);c.css("width",a+"px")}),a(window).on("scroll",function(){for(var b=a(window).scrollTop(),e=0,g=0;g<c.length;g++)0!=c.eq(g).attr("data-offset")?b>=d[g][2]+d[g][0]&&e++:b>=d[g][0]&&e++;f(e)}),a(window).on("resize",function(){c.css("width",a(b.containerElement).width()+"px"),g()})},a.fn.stickyStack.options={containerElement:".main-content-wrapper",stackingElement:"section",boxShadow:"0 -3px 20px rgba(0, 0, 0, 0.25)"}}(jQuery);


$(window).load(function() {
  $('section').css('min-height', $(window).height());

  $('.main-content-wrapper').stickyStack();
});




// analytics
(function(d,e,j,h,f,c,b){d.GoogleAnalyticsObject=f;d[f]=d[f]||function(){(d[f].q=d[f].q||[]).push(arguments)},d[f].l=1*new Date();c=e.createElement(j),b=e.getElementsByTagName(j)[0];c.async=1;c.src=h;b.parentNode.insertBefore(c,b)})(window,document,"script","//www.google-analytics.com/analytics.js","ga");ga("create","UA-53573814-1","auto");ga("send","pageview");
