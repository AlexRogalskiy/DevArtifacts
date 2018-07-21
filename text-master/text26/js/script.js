"use strict";

$(document).ready(function() {
  var paths = document.querySelectorAll("path");
  var timeouts = [];
  var stagger = 200;

  draw();
  
  $(".demo__rerun").on("click", draw);
  
  setTimeout(function() {
    $(".me").addClass("shown");
  }, stagger * paths.length);
  
  function clearTimeouts(arr) {
    arr.forEach(function(a) {
      clearTimeout(a);
    });
  }
  
  function draw() {
    clearTimeouts(timeouts);
    $(".demo__svg").addClass("hidden");
    $(paths).removeClass("animatable").css("fill", "transparent");

    [].forEach.call(paths, function(path) {
      $(path).css({
        "stroke-dasharray": path.getTotalLength(),
        "stroke-dashoffset": path.getTotalLength()
      });
    });

    $(".demo__svg").removeClass("hidden");

    [].forEach.call(paths, function(path, i) {
      timeouts[i] = setTimeout(() => {
        $(path).addClass("animatable");
        $(path).css({
          "stroke-dashoffset": 0,
          "fill": "white"
        });
      }, i * stagger);
    });
  }  
});