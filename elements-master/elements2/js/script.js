/*

*************
30.10 ~ included vendor prefixes
28.10 ~ added code that closed the upload frame if we click outside of our avatar.

This is the jQuery solution to our animation. Out of performance reasons I would always advise the usage of CSS animations or some other GPU accelerated animations with the  use of TweenJS, GSAP or VelocityJS.

I hope you like the animation, thanks! :)

*************

var circle = $('#circle').get(0);
var cl = circle.getTotalLength();

var frame = $('#cameraFrame').get(0);
var fl = frame.getTotalLength();

var plusG = $('#plus')
var plusLine = $('#plusLine').get(0).getTotalLength();
$(plusG).css({
  'stroke-dasharray':plusLine,
  'stroke-dashoffset':plusLine
});
$(circle).css({
  'stroke-dasharray':cl,
  'stroke-dashoffset':cl
});
console.log(plusLine)
$(frame).css({
  'stroke-dasharray':fl,
  'stroke-dashoffset':fl-fl
});
/*
$('.avatar').hover(
  function(){
    $(circle).css({
      'stroke-dashoffset':0
    });
    $(frame).css({
      'stroke-dashoffset':0
    });
    $(plusG).css({
      'stroke-dashoffset':0
    });
},function(){
   $(circle).css({
      'stroke-dashoffset':cl});
    $(frame).css({
      'stroke-dashoffset':fl
    });
  $(plusG).css({
      'stroke-dashoffset':plusLine
    });
});*/
$('#fileUpload').on('change',function(){
  $('.avatar').removeClass('open');
});
$('.avatar').on('click',function(){
  $(this).addClass('open');
});
// added code to close the modal if you click outside
$('html').click(function() {
 $('.avatar').removeClass('open');
});

$('.avatar').click(function(event){
    event.stopPropagation();
});

