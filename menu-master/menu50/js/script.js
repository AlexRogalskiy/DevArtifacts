/*******************************************************************************
 *
 * jquery.scrollto.js 0.0.1 - https://github.com/yckart/jquery.scrollto.js
 * Scroll smooth to any element in your DOM.
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/17
 *
 */



$.scrollTo = $.fn.scrollTo = function(x, y, options) {
  if (!(this instanceof $)) return $.fn.scrollTo.apply($("html, body"), arguments);

  options = $.extend({}, {
    gap: {
      x: 0,
      y: 0
    },
    animation: {
      easing: "swing",
      duration: 500,
      complete: $.noop,
      step: $.noop
    }
  }, options);

  return this.each(function() {
    var elem = $(this);
    elem.stop().animate({
      scrollLeft: !isNaN(Number(x)) ? x : $(y).offset().left + options.gap.x,
      scrollTop: !isNaN(Number(y)) ? y : $(y).offset().top + options.gap.y
    }, options.animation);
  });
};



/*******************************************************************************
 *
 * http://callmenick.com/post/single-page-site-with-smooth-scrolling-highlighted-link-and-fixed-navigation
 *
 */



$(document).ready(function() {

  // add nav items dynamically
  $(".section").each(function() {
    var href = $(this).attr("id");
    var nav = $(this).attr("data-nav");
    $(".nav").append("<li><a href='#"+ href + "'>" + nav + "</a></li>");
  });

  // add smooth scrolling
  $(".nav a").click(function(evn) {
    evn.preventDefault();
    $("html,body").scrollTo(this.hash, this.hash);
  });

  // highlighting functionality
  var aChildren = $(".nav li").children(); // find the a children of the list items
  var aArray = []; // create the empty aArray
  for (var i = 0; i < aChildren.length; i++) {
    var aChild = aChildren[i];
    var ahref = $(aChild).attr("href");
    aArray.push(ahref);
  } // this for loop fills the aArray with attribute href values

  $(window).scroll(function() {
    var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
    var windowHeight = $(window).height(); // get the height of the window
    var docHeight = $(document).height();

    for (var i = 0; i < aArray.length; i++) {
      var theID = aArray[i];
      var divPos = $(theID).offset().top; // get the offset of the div from the top of page
      var divHeight = $(theID).outerHeight(); // get the height of the div in question
      if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
        $("a[href='" + theID + "']").addClass("nav-active");
      } else {
        $("a[href='" + theID + "']").removeClass("nav-active");
      }
    }

    // active state for last item
    if (windowPos + windowHeight == docHeight) {
      if (!$(".nav li:last-child a").hasClass("nav-active")) {
        $(".nav a").removeClass("nav-active");
        $(".nav li:last-child a").addClass("nav-active");
      }
    }

    // active state for first item
    if (windowPos < $(".section:first-child").offset().top) {
      $(".nav li:first-child a").addClass("nav-active");
    }
  });

  // active state for first item on initial load
  $(".nav li:first-child a").addClass("nav-active");
});



// Force outerHeight integer

$(window).on("load", function() {

  $(".section").each(function() {
    var integer = Math.ceil($(this).outerHeight());
    var decimal = $(this).outerHeight();
    var sum = integer - decimal;

    if(integer != decimal) {
      $(this).children().css("margin-bottom",sum);
    }

    // console.log($(this).outerHeight());
  });

});
