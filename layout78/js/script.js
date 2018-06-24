$(document).ready(function() {
  $('.smarter-image').smarterImages({
    useCloudImageIO: true,
    cloudImageIO: 'demo05',
    
    upsizeOnly: false,

    // callback writes img size to inner <div/>
    onImgSwap: function($this, thisBreakpoint) {
      $this.find('.size-overlay').html(thisBreakpoint + ' x ' + $this.outerHeight(true));
      $this.fadeIn();
    }
  });
});
  

/*
***********************************************************
* smarterImages | Images are dumb - make them smarter
* 
* Version:		v1.0.0
* Author:	 	Mike Zarandona
* Release:		August 04 2014
* 				   Initial release.
* 
* Reqs:        jQuery
* 
* Usage:		  $('img[data-si-src]').smarterImages();
***********************************************************
*/
!function(a,b){function c(a,b){var c;if(b>0&&b<a.breakpoints[1])c=a.breakpoints[0];else if(b>=a.breakpoints[a.breakpoints.length-1])c=a.breakpoints[a.breakpoints.length-1];else for(var d=1;d<a.breakpoints.length-1;d++)b>=a.breakpoints[d]&&b<a.breakpoints[d+1]&&(c=a.breakpoints[d]);return c}function d(a,c,d,e){var g=!1,h=!1,i="";if(a.maintainAspect&&c.attr("data-si-aspect")===b){var j=c.innerHeight(),k=c.innerWidth(),l=k/j;c.attr("data-si-aspect",l)}if(a.useCloudImageIO)if(a.maintainAspect){var m=parseInt(c.attr("data-si-aspect")),n=Math.floor(d/m);i=a.protocol+a.cloudImageIO+".cloudimage.io/s/crop/"+d+"x"+n+"/"+c.attr("data-si-src")}else i=a.protocol+a.cloudImageIO+".cloudimage.io/s/resize/"+d+"/"+c.attr("data-si-src");else a.useCustomURL?i=f(a,c,d):a.usePlaceholders?i=a.protocol+"placehold.it/"+d+"x"+d:a.logging&&console.error("SmarterImages Error: No processors active!");h="IMG"==c.get(e).tagName?!0:!1,g=h?c.attr("src")!=i?!0:!1:c.css("background-image")!="url("+i+")"?!0:!1,g&&(h?c.attr("src",i):c.css("background-image","url("+i+")")),a.upsizeOnly&&c.attr("data-si-maxsize",d)}function e(a,c,d){var e=!1;if(a.upsizeOnly){var f=c.attr("data-si-maxsize");f===b?e=!0:(f=parseInt(f),d>=f&&(e=!0))}else e=!0;return e}function f(a,c,d){var e=a.customURL,f=[];f=e.split("%%size%%"),e=f[0];for(var g=1;g<f.length;g++)e+=d+f[g];return f=e.split("%%source%%"),c.attr("data-si-src")===b&&a.logging&&console.error("SmarterImages Error:  Attribute `data-si-src` is undefined for "+c.get(0).tagName+"."+c.get(0).className),e=f[0]+c.attr("data-si-src")+f[1]}a.fn.smarterImages=function(b){var f=a(this);b=a.extend({},a.fn.smarterImages.options,b),b.logging&&console.info("SmarterImages initialized"),a(window).on("load resize",function(){var g=a(window).outerWidth(!0),h=c(b,g);f.each(function(a){var c=e(b,f,h,a);c&&(d(b,f,h,a),"function"==typeof b.onImgSwap&&b.onImgSwap(f,h))})})},a.fn.smarterImages.options={breakpoints:[360,480,768,1050,1300,1600],upsizeOnly:!0,maintainAspect:!1,useCloudImageIO:!1,cloudImageIO:"",useCustomURL:!1,customURL:"",usePlaceholders:!1,protocol:"http://",logging:!1,onImgSwap:!1}}(jQuery);
