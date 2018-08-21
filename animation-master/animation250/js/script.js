$(document).on("mousemove", function(event) {
  $(".hole").css({
    "top": event.pageY,
    "left": event.pageX
  });
});