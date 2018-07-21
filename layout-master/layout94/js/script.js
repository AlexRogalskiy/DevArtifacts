"use strict";

$(document).ready(function() {

  var $pic_3_1 = $(".demo__lay-3-1-picture");
  var curPic = 0;
  var timeout = null;

  $pic_3_1.on("click", function() {
    
    var self = this;
    curPic = +$(this).attr("inFrameIndex") - 1;
    
    $pic_3_1.removeClass("inanimatable");
    
    $pic_3_1.removeClass("active inactive inactive-1 inactive-2 inactive-3").addClass("inactive inactive-" + $(self).attr("inFrameIndex"));
    
    $(self).addClass("active").removeClass("inactive");
    
    clearTimeout(timeout);

    timeout = setTimeout(function() {
      $pic_3_1.eq(curPic).trigger("click");
      if (curPic >= 2) curPic = 0;
      else curPic++;
    }, 10000);
  });
  
  $(window).on("resize", function() {
    $pic_3_1.addClass("inanimatable");
  });
  
  //this is here just so it will animate in the iframe and attract more attention :) 
  setTimeout(function() {
    $pic_3_1.eq(Math.floor(Math.random() * 3)).trigger("click");
  }, 400);

});