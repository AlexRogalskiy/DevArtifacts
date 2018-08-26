$(function() {
  var $left = $(".left")
  var $right = $(".right")
  
  $(document).on("mousemove", function(event) {
    var width = $(document).width();
    var x = event.clientX;
    
    var leftRatio = 1- x / width;
    var rightRatio = 1 - leftRatio;
    
    $left.css("transform", "scale(" + (1 + leftRatio) + ")");
    
    $right.css("transform", "scale(" + (1 + rightRatio) + ")");
    console.log(leftRatio)
     console.log(rightRatio)
  })
});