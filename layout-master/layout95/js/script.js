//the quality of the following code is not the best as i was writing it shortly after i just got into coding. This should really be refactored but unfortunately i don't have time to do it. So if you want to try and understand what happens in the code, i'm sorry in advance
$(document).ready(function() {
 var curX = 0;
 var diff = 0;
 var curSlide = 1;
 var busy = false;
 var flag = false;
 var winW = parseInt($(".demo-container").css("width"));
 var animationTime = parseFloat($(".property-hack").css("height"));
 var k = parseFloat($(".property-hack").css("width")) / 100;
 var numOfSlides = $(".slide").length;
 var autoChangeTime = parseFloat($(".property-hack").css("margin-left"));
 var autoChangeInterval = setInterval(autoChangeFunction, autoChangeTime);
 $(".slide-1 .overlay").addClass("overlay-active");
 $(window).on("keydown", function(event) {
  if (!busy) {
   if (event.which == 37 && curSlide >= 2) {
    curSlide--;
    animation();
   }
   if (event.which == 39 && curSlide < numOfSlides) {
    curSlide++;
    animation();
   }
  }
 });
 $(".dot").on("click", function() {
  if (!busy) {   
   curSlide = parseInt($(this).attr("where"));
   animation(true);   
  }
 });
 $(document).on("mousedown touchstart", ".slides", function(event) {
  if (!busy) {
   clearInterval(autoChangeInterval);
   flag = true;
   $(".demo-container").addClass("grabbing");
   winW = parseInt($(".demo-container").css("width"));
   if (event.originalEvent.touches) var stX = event.originalEvent.touches[0].pageX;
   else var stX = event.pageX;
   $(document).on("mousemove touchmove", function(event) {
    if (busy) return;
    if (event.originalEvent.touches) var msX = event.originalEvent.touches[0].pageX;
    else var msX = event.pageX;
    diff = (msX - stX) / winW * 100 / k;
    if (diff > 110) diff = 110;
    if (diff < -110) diff = -110;
    if (curSlide == 1) {
     if (diff > 0) diff /= 10;
     if (diff > 5) diff = 5;
    }
    if (curSlide == numOfSlides) {
     if (diff < 0) diff /= 10;
     if (diff < -5) diff = -5;
    }
    $(".slides").css("transform", "translate3d(" + (diff + curX) + "vw, 0, 0)");
    $(".bg-" + curSlide).css("transform", "translate3d(" + (-diff / 2) + "vw, 0, 0)");
    $(".bg-" + (curSlide + 1)).css("transform", "translate3d(" + (-50 - diff / 2) + "vw, 0, 0)");
    $(".bg-" + (curSlide - 1)).css("transform", "translate3d(" + (50 - diff / 2) + "vw, 0, 0)");
   });
  }
 });
 $(document).on("mouseup touchend", function(event) {
  if (flag) {
   if (diff * k < -30) curSlide++;
   else if (diff * k > 30)
    curSlide--;
   animation();
   diff = 0;
   $(document).off("mousemove touchmove");
   $(".demo-container").removeClass("grabbing");
   flag = false;
  }
 });

 function animation(r) {
  busy = true;
  curX = (-curSlide + 1) * 100;
  $(".overlay").removeClass("overlay-active");  
  $(".slide-" + curSlide + " .overlay").addClass("overlay-active");
  $(".dot").css("opacity", "0.3");
  $(".dot-" + curSlide).css("opacity", "1");
  $(".slides").addClass("animation");
  if (!r)  $(".bg").addClass("animation");
  else $(".bg").css("transform", "translate3d(0, 0, 0)");
  $(".slides").css("transform", "translate3d(-" + (curSlide - 1) * 100 + "vw, 0, 0)");
  $(".bg").css("transform", "translate3d(0, 0, 0)");
  if (!r) {
   $(".bg-" + (curSlide + 1) + ", .bg-" + (curSlide + 2)).css("transform", "translate3d(-50vw, 0, 0)");
   $(".bg-" + (curSlide - 1) + ", .bg-" + (curSlide - 2)).css("transform", "translate3d(50vw, 0, 0)");
  }
  clearInterval(autoChangeInterval);
  setTimeout(function() {
   $(".slides, .bg").removeClass("animation");
   busy = false;
   $(".bg-" + (curSlide + 1)).css("transform", "translate3d(-50vw, 0, 0)");   
   autoChangeInterval = setInterval(autoChangeFunction, autoChangeTime);
  }, animationTime);
 }

 function autoChangeFunction() {
  if (curSlide != numOfSlides) {
   curSlide++;
   animation();
  }
  else {
   curSlide = 1;
   animation(true);
  }
 }
});