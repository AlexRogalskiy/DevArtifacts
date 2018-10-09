/* == malihu jquery custom scrollbar plugin == Version: 3.0.9, License: MIT License (MIT) 

Also, normally I would target $("body").css("cursor","n-resize"), but the iframe seems to be preventing that. My work-around is that I've set a height to the rest of the document to give it the cursor effect.

*/

$("header .header-content").mCustomScrollbar();
$(".dropdown").click(function() {
  if ($(".open").length) {
    $("header").removeClass("open");
  } else {
    $("header").addClass("open");
  }
})
$(document).click(function(e) {

  if ($(".open").length) {
    if (!$(e.target).closest('header').length && !$(e.target).closest('li').length && !wasDragging) {
      $(".open").removeAttr("class");
    }
  }
})

var isDragging = false,
  wasDragging = false,
  headerTop = $("header").offset().top;

$(".resize-bar").mousedown(function(e) {
  isDragging = true;
  wasDragging = true;
  $("header.open").css("transition", "all 0s");
})
$(document)
  .mousemove(function(e) {
    if (isDragging) {
      e.preventDefault();
      $("header style").html("header.open {height:" + (e.pageY - headerTop) + "px;}");
      $(".content").css("cursor","n-resize");
    }
  })
  .mouseup(function() {
    if (isDragging) {
      isDragging = false;
      setTimeout(function() {
        wasDragging = false;
      }, 100);
      $("header.open").css("transition", "");
      $(".content").css("cursor", "");
    }
  })